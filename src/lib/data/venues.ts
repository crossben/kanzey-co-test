import type { Venue } from '@/lib/types'

/** Lieux réels, relevés sur fodium.kanzey.co. */
export const venues: Venue[] = [
  { id: 'dakar-arena', name: 'Dakar Arena', city: 'Diamniadio', capacity: 15000 },
  { id: 'sorano', name: 'Théâtre Daniel Sorano', city: 'Dakar', capacity: 8000 },
  { id: 'magic-land', name: 'Magic Land', city: 'Dakar', capacity: 3000 },
  { id: 'cristallines', name: 'Résidence les Cristallines', city: 'Saly', capacity: 500 },
]

export function getVenue(id: string): Venue {
  const venue = venues.find((v) => v.id === id)
  if (!venue) throw new Error(`Lieu inconnu : ${id}`)
  return venue
}
