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
