import type { Route } from '@/lib/types'

/**
 * Liaisons interurbaines Fodium Transport.
 *
 * Elles existent indépendamment des événements : c'est le second volet de la
 * recherche unifiée exigée par le brief §3.2 (« événements et trajets »).
 * Distances et durées correspondent aux liaisons routières réelles.
 */
export const routes: Route[] = [
  { id: 'dakar-thies', from: 'Dakar', to: 'Thiès', price: 3000, durationMin: 90, distanceKm: 70, departures: ['06:30', '09:00', '13:00', '17:30'] },
  { id: 'dakar-mbour', from: 'Dakar', to: 'Mbour — Saly', price: 4000, durationMin: 120, distanceKm: 85, departures: ['07:00', '11:00', '16:00'] },
  { id: 'dakar-touba', from: 'Dakar', to: 'Touba', price: 6000, durationMin: 210, distanceKm: 195, departures: ['06:00', '14:00'] },
  { id: 'dakar-saint-louis', from: 'Dakar', to: 'Saint-Louis', price: 8000, durationMin: 270, distanceKm: 265, departures: ['06:00', '15:00'] },
  { id: 'dakar-kaolack', from: 'Dakar', to: 'Kaolack', price: 5500, durationMin: 210, distanceKm: 190, departures: ['07:30', '16:30'] },
  { id: 'dakar-ziguinchor', from: 'Dakar', to: 'Ziguinchor', price: 15000, durationMin: 600, distanceKm: 455, departures: ['05:30'] },
]
