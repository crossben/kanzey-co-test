import type { Event } from './types'
import { normalize } from './search'

export type EventFilters = {
  category?: string
  query?: string
}

/**
 * Filtre et trie les événements pour la page Événements.
 *
 * Le tri par date croissante est appliqué dans tous les cas : sur une
 * billetterie, l'ordre utile est toujours « ce qui arrive bientôt d'abord ».
 * La fonction ne modifie jamais la liste reçue.
 */
export function filterEvents(events: Event[], { category, query }: EventFilters): Event[] {
  const q = query ? normalize(query) : ''

  return events
    .filter((event) => {
      if (category && event.category !== category) return false
      if (!q) return true

      const haystack = normalize(
        [event.title, event.venue.name, event.venue.city, event.category].join(' '),
      )
      return haystack.includes(q)
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}
