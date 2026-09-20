import type { Departure, Event } from './types'
import { getEventBySlug } from './data/events'
import { getDeparture } from './data/departures'
import { computeTotal } from './pricing'

export type ParsedOrder = {
  event: Event
  departure?: Departure
  slot?: string
  total: number
}

/**
 * Lien vers le paiement, portant la composition du pass.
 *
 * La commande voyage dans l'URL plutôt que dans un état client : le lien
 * reste valable après un rechargement, peut se partager, et le paiement
 * n'impose pas d'arriver par un chemin précis.
 *
 * Une navette sans créneau n'est pas transmise : la commande serait
 * incomplète, et l'URL doit représenter un état valide.
 */
export function buildPaymentHref(
  event: Event,
  departure?: Departure,
  slot?: string,
): string {
  const base = `/paiement/${event.slug}`
  if (!departure || !slot) return base

  const params = new URLSearchParams({ navette: departure.id, creneau: slot })
  return `${base}?${params}`
}

/**
 * Reconstruit la commande depuis l'URL.
 *
 * Toute navette incomplète ou inconnue est abandonnée plutôt que de faire
 * échouer la page : l'utilisateur retombe sur un billet seul, qui reste un
 * état valide. Seul un événement inconnu justifie un échec.
 */
export function parseOrder(
  slug: string,
  params: { navette?: string; creneau?: string },
): ParsedOrder | null {
  const event = getEventBySlug(slug)
  if (!event) return null

  const departure = params.navette ? getDeparture(params.navette) : undefined
  const slotExists = Boolean(
    departure && params.creneau && departure.slots.some((s) => s.time === params.creneau),
  )

  const validDeparture = slotExists ? departure : undefined
  const validSlot = slotExists ? params.creneau : undefined

  return {
    event,
    departure: validDeparture,
    slot: validSlot,
    total: computeTotal(event, validDeparture),
  }
}

/**
 * Référence du billet, encodée dans le QR.
 *
 * Déterministe : la même commande produit toujours la même référence, ce qui
 * permet de rouvrir un billet sans stockage serveur. Un vrai système y
 * mettrait un identifiant signé — ici le prototype n'a pas de backend.
 */
export function ticketReference(order: ParsedOrder): string {
  const parts = [
    order.event.id,
    order.departure?.id ?? 'x',
    order.slot?.replace(':', '') ?? 'x',
  ]
  return `FDM-${parts.join('-').toUpperCase()}`
}
