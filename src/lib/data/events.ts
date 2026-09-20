import type { Event } from '@/lib/types'
import { getVenue } from './venues'

/**
 * Événements mockés, ancrés dans la réalité dakaroise.
 * Le brief en exige trois au minimum ; on en propose six pour que la page
 * d'accueil ait de quoi respirer et que les filtres aient du sens.
 *
 * `accent` pilote la bascule de couleur d'ambiance de la page d'accueil :
 * chaque événement doit donc porter une teinte nettement distincte.
 */
export const events: Event[] = [
  {
    id: '1',
    slug: 'joj-dakar-2026',
    title: "JOJ Dakar 2026 — Cérémonie d'ouverture",
    date: '2026-10-31T19:00:00Z',
    venue: getVenue('dakar-arena'),
    priceFrom: 15000,
    image: '/events/joj.jpg',
    accent: '#f07f00',
    capacity: 15000,
    sold: 11700,
    category: 'Sport',
  },
  {
    id: '2',
    slug: 'senegal-fashion-week',
    title: 'Cavalcante Senegal Fashion Week',
    date: '2026-10-03T18:00:00Z',
    venue: getVenue('magic-land'),
    priceFrom: 5000,
    image: '/events/fashion.jpg',
    accent: '#d946ef',
    capacity: 3000,
    sold: 2340,
    category: 'Mode',
  },
  {
    id: '3',
    slug: 'youssou-ndour-grand-bal',
    title: "Youssou N'Dour — Grand Bal",
    date: '2026-11-14T21:00:00Z',
    venue: getVenue('sorano'),
    priceFrom: 10000,
    image: '/events/grand-bal.jpg',
    accent: '#22c55e',
    capacity: 8000,
    sold: 7650,
    category: 'Concert',
  },
  {
    id: '4',
    slug: 'pool-brunch-all-white',
    title: 'Pool Brunch — All White',
    date: '2026-10-18T12:00:00Z',
    venue: getVenue('cristallines'),
    priceFrom: 20000,
    image: '/events/pool-brunch.jpg',
    accent: '#38bdf8',
    capacity: 500,
    sold: 190,
    category: 'Lifestyle',
  },
  {
    id: '5',
    slug: 'lutte-choc-de-lannee',
    title: "Lutte avec frappe — Choc de l'année",
    date: '2026-11-29T17:00:00Z',
    venue: getVenue('dakar-arena'),
    priceFrom: 7500,
    image: '/events/lutte.jpg',
    accent: '#ef4444',
    capacity: 15000,
    sold: 14100,
    category: 'Sport',
  },
  {
    id: '6',
    slug: 'dakar-comedy-club',
    title: 'Dakar Comedy Club — Saison 4',
    date: '2026-10-25T20:30:00Z',
    venue: getVenue('sorano'),
    priceFrom: 6000,
    image: '/events/comedy.jpg',
    accent: '#fbbf24',
    capacity: 8000,
    sold: 3200,
    category: 'Humour',
  },
]

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug)
}

/** Catégories présentes, pour les filtres de la page Événements. */
export const categories = [...new Set(events.map((e) => e.category))].sort()
