import type { PaymentMethod } from './types'
import { parseOrder, type ParsedOrder } from './order'

export const WALLET_KEY = 'fodium.billets.v1'

/**
 * Billet tel qu'il est conservé.
 *
 * On ne stocke que ce qui identifie la commande, jamais l'événement complet :
 * les données de référence évoluent, et un objet figé se désynchroniserait.
 * Le billet est reconstitué à la lecture par `hydrateTicket`.
 */
export type StoredTicket = {
  ref: string
  slug: string
  departureId?: string
  slot?: string
  method: PaymentMethod
  /** Date ISO de l'achat. */
  purchasedAt: string
}

/**
 * Le stockage local peut échouer : navigation privée, stockage bloqué,
 * quota dépassé. Aucune de ces situations ne doit casser la page — le
 * portefeuille apparaît alors simplement vide.
 */
function safeRead(): string | null {
  try {
    return localStorage.getItem(WALLET_KEY)
  } catch {
    return null
  }
}

/** Événement interne : `storage` ne se déclenche que dans les AUTRES onglets. */
const WALLET_EVENT = 'fodium:wallet'

function safeWrite(tickets: StoredTicket[]): void {
  try {
    localStorage.setItem(WALLET_KEY, JSON.stringify(tickets))
  } catch {
    // Silencieux à dessein : perdre la persistance ne doit pas empêcher
    // d'utiliser l'application.
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(WALLET_EVENT))
  }
}

/**
 * Abonnement aux changements du portefeuille, pour `useSyncExternalStore`.
 *
 * Deux sources : `storage` couvre les autres onglets, l'événement interne
 * couvre l'onglet courant — que `storage` ignore par conception.
 */
export function subscribeWallet(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', onChange)
  window.addEventListener(WALLET_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(WALLET_EVENT, onChange)
  }
}

/**
 * Instantané brut du portefeuille.
 *
 * Renvoie la chaîne stockée, pas un tableau : `useSyncExternalStore` compare
 * les instantanés par identité, et reconstruire un tableau à chaque appel
 * provoquerait une boucle de rendu infinie.
 */
export function walletSnapshot(): string | null {
  return safeRead()
}

export function readWallet(): StoredTicket[] {
  const raw = safeRead()
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    // Le contenu vient du navigateur de l'utilisateur : il peut avoir été
    // modifié ou écrit par une version antérieure du schéma.
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t): t is StoredTicket =>
        typeof t?.ref === 'string' && typeof t?.slug === 'string',
    )
  } catch {
    return []
  }
}

/** Ajoute un billet. Le plus récent d'abord ; un même billet n'est jamais dupliqué. */
export function addToWallet(ticket: StoredTicket): void {
  const existing = readWallet().filter((t) => t.ref !== ticket.ref)
  safeWrite([ticket, ...existing])
}

export function removeFromWallet(ref: string): void {
  safeWrite(readWallet().filter((t) => t.ref !== ref))
}

/**
 * Reconstitue la commande complète à partir du billet stocké.
 *
 * Retourne `null` si l'événement n'existe plus : un billet orphelin est
 * écarté de l'affichage plutôt que de faire échouer la page.
 */
export function hydrateTicket(ticket: StoredTicket): ParsedOrder | null {
  return parseOrder(ticket.slug, {
    navette: ticket.departureId,
    creneau: ticket.slot,
  })
}
