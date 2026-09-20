import type { Event, Departure } from './types'

/**
 * Total d'une commande, en XOF.
 *
 * C'est le cœur du pass combiné : le prix doit se recalculer dès que
 * l'utilisateur ajoute ou retire la navette (brief §3.3).
 */
export function computeTotal(event: Event, departure?: Departure): number {
  return event.priceFrom + (departure?.price ?? 0)
}

/** Places restantes. Jamais négatif, même si les données sont incohérentes. */
export function seatsLeft(event: Event): number {
  return Math.max(0, event.capacity - event.sold)
}

/** Taux de remplissage, de 0 à 1. */
export function soldRatio(event: Event): number {
  if (event.capacity <= 0) return 0
  return Math.min(1, event.sold / event.capacity)
}

/**
 * Un événement est « presque complet » au-delà de 90 % de remplissage.
 * Seuil unique ici plutôt que dispersé dans les composants : c'est une règle
 * métier, pas une décision d'affichage.
 */
export function isAlmostSoldOut(event: Event): boolean {
  return soldRatio(event) >= 0.9
}
