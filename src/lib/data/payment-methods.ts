import type { PaymentMethod } from '@/lib/types'

export type PaymentMethodInfo = {
  id: PaymentMethod
  label: string
  /** Sous-titre : ce que l'utilisateur verra réellement se passer. */
  hint: string
  /** Dégradé du jeton, aux couleurs de l'opérateur. */
  from: string
  to: string
  /** Couleur du texte posé sur le jeton — vérifiée pour le contraste. */
  ink: string
}

/**
 * Moyens de paiement réellement acceptés par Fodium, relevés sur le site
 * existant : « Wave, Orange Money, Free Money et carte bancaire acceptés ».
 *
 * Les couleurs sont celles des opérateurs, pas celles de Fodium : un jeton
 * doit se reconnaître d'un coup d'œil, avant même d'être lu.
 */
export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'wave',
    label: 'Wave',
    hint: 'Confirmation dans l’application Wave',
    from: '#1DC8F5',
    to: '#0A7EA8',
    ink: '#06232e',
  },
  {
    id: 'orange-money',
    label: 'Orange Money',
    hint: 'Code reçu par SMS',
    from: '#FF8A1F',
    to: '#C25A00',
    ink: '#2b1400',
  },
  {
    id: 'free-money',
    label: 'Free Money',
    hint: 'Code reçu par SMS',
    from: '#F3324A',
    to: '#A30016',
    ink: '#2e0007',
  },
  {
    id: 'card',
    label: 'Carte bancaire',
    hint: 'Visa, Mastercard',
    from: '#9CA3AF',
    to: '#4B5563',
    ink: '#111827',
  },
]

export function getPaymentMethod(id: PaymentMethod): PaymentMethodInfo {
  const method = PAYMENT_METHODS.find((m) => m.id === id)
  if (!method) throw new Error(`Moyen de paiement inconnu : ${id}`)
  return method
}
