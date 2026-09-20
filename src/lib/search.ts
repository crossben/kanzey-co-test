import type { Event, Route } from './types'
import { events } from './data/events'
import { routes } from './data/routes'

export type SearchResult =
  | { kind: 'event'; event: Event }
  | { kind: 'route'; route: Route }

/**
 * Plafonds séparés plutôt qu'un plafond global.
 *
 * Avec un seul plafond, une requête comme « dakar » — qui correspond à la
 * fois à des lieux d'événements et à des origines de trajets — remplit la
 * liste d'événements et repousse les trajets hors de l'écran. Or c'est
 * exactement leur cohabitation qui rend la recherche unifiée perceptible.
 */
const MAX_EVENTS = 5
const MAX_ROUTES = 3

/**
 * Minuscules sans accents.
 * Indispensable ici : personne ne tape « Thiès » ni « Événements » avec les
 * accents dans un champ de recherche.
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
}

/** Champs d'un événement sur lesquels la recherche porte. */
function eventHaystack(event: Event): string {
  return normalize(
    [event.title, event.venue.name, event.venue.city, event.category].join(' '),
  )
}

function routeHaystack(route: Route): string {
  return normalize([route.from, route.to].join(' '))
}

/**
 * Recherche unifiée sur les événements et les trajets (brief §3.2).
 *
 * Un seul champ interroge les deux catalogues : c'est ce qui rend tangible la
 * double offre billetterie + transport, au lieu de la juxtaposer.
 */
export function searchAll(query: string): SearchResult[] {
  const q = normalize(query)
  if (!q) return []

  return [
    ...events
      .filter((event) => eventHaystack(event).includes(q))
      .slice(0, MAX_EVENTS)
      .map((event) => ({ kind: 'event' as const, event })),
    ...routes
      .filter((route) => routeHaystack(route).includes(q))
      .slice(0, MAX_ROUTES)
      .map((route) => ({ kind: 'route' as const, route })),
  ]
}
