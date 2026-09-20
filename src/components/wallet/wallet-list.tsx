'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import { Ticket as TicketIcon, Trash2 } from 'lucide-react'
import { Ticket } from '@/components/ticket/ticket'
import { QrCode } from '@/components/ticket/qr-code'
import { Holographic } from './holographic'
import {
  hydrateTicket,
  removeFromWallet,
  subscribeWallet,
  walletSnapshot,
  type StoredTicket,
} from '@/lib/wallet'
import { getPaymentMethod } from '@/lib/data/payment-methods'
import type { QrMatrix } from '@/lib/qr'

/**
 * Matrice QR côté client.
 *
 * Contrairement à la page de paiement, le portefeuille ne peut pas préparer
 * les QR côté serveur : il ne sait qu'au runtime quels billets l'utilisateur
 * possède. La librairie d'encodage n'est donc chargée que sur cette route.
 */
function clientQr(text: string): QrMatrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' })
  const size = qr.modules.size
  const data = qr.modules.data
  const modules: boolean[][] = []
  for (let row = 0; row < size; row++) {
    const line: boolean[] = []
    for (let col = 0; col < size; col++) line.push(Boolean(data[row * size + col]))
    modules.push(line)
  }
  return { size, modules }
}

function parseTickets(raw: string | null): StoredTicket[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t): t is StoredTicket => typeof t?.ref === 'string' && typeof t?.slug === 'string',
    )
  } catch {
    return []
  }
}

export function WalletList() {
  // `useSyncExternalStore` plutôt qu'un effet : le portefeuille vit dans le
  // navigateur, pas dans React. L'instantané est la chaîne brute — renvoyer
  // un tableau reconstruit à chaque appel boucherait le rendu.
  const raw = useSyncExternalStore(subscribeWallet, walletSnapshot, () => null)
  const tickets = useMemo(() => parseTickets(raw), [raw])

  if (tickets.length === 0) return <EmptyWallet />

  return (
    <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tickets.map((stored) => {
        const order = hydrateTicket(stored)
        // Billet orphelin (événement retiré) : on l'écarte silencieusement
        // plutôt que de faire échouer toute la page.
        if (!order) return null

        const method = getPaymentMethod(stored.method)
        const purchased = new Date(stored.purchasedAt)

        return (
          <li key={stored.ref}>
            <Holographic>
              <Ticket
                event={order.event}
                variant="mini"
                total={order.total}
                shuttle={
                  order.departure && order.slot
                    ? { district: order.departure.district, time: order.slot }
                    : undefined
                }
                footer={
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 rounded-lg bg-white p-1.5">
                      <QrCode matrix={clientQr(stored.ref)} className="size-16" />
                    </div>
                    <div className="min-w-0">
                      <p className="break-all font-mono text-[11px]">{stored.ref}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {method.label} ·{' '}
                        {purchased.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                }
              />
            </Holographic>

            <button
              type="button"
              onClick={() => removeFromWallet(stored.ref)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive focus-visible:underline"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Retirer ce billet
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function EmptyWallet() {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
      <TicketIcon className="mx-auto size-8 text-muted-foreground" aria-hidden />
      <p className="mt-4 font-display text-xl">Aucun billet pour l&apos;instant</p>
      <p className="mx-auto mt-2 max-w-prose text-sm text-muted-foreground">
        Vos billets apparaissent ici dès l&apos;achat, avec leur QR, et restent
        accessibles hors connexion.
      </p>
      <Link
        href="/evenements"
        className="mt-6 inline-flex text-sm text-brand-text underline-offset-4 hover:underline"
      >
        Découvrir les événements
      </Link>
    </div>
  )
}
