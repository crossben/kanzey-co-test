import type { Departure } from '@/lib/types'

/**
 * Quartiers réels de l'agglomération dakaroise.
 *
 * `coords` positionne le marqueur dans le viewBox SVG `0 0 100 100` de la
 * carte. Les positions respectent la géographie relative : la presqu'île du
 * Cap-Vert pointe vers l'ouest (Almadies, Ouakam), le Plateau occupe la
 * pointe sud-est, et la banlieue (Pikine, Guédiawaye, Rufisque) s'étend au
 * nord-est.
 */
const slotsFor = (peak: number) => [
  { time: '15:00', load: Number((peak * 0.4).toFixed(2)) },
  { time: '16:00', load: Number((peak * 0.7).toFixed(2)) },
  { time: '17:00', load: peak },
  { time: '18:00', load: Number((peak * 0.85).toFixed(2)) },
]

export const departures: Departure[] = [
  { id: 'plateau', district: 'Plateau', coords: [72, 78], price: 2000, durationMin: 45, slots: slotsFor(0.9) },
  { id: 'almadies', district: 'Almadies', coords: [18, 52], price: 3000, durationMin: 60, slots: slotsFor(0.6) },
  { id: 'ouakam', district: 'Ouakam', coords: [28, 62], price: 2500, durationMin: 55, slots: slotsFor(0.75) },
  { id: 'mermoz', district: 'Mermoz — Sacré-Cœur', coords: [42, 66], price: 2500, durationMin: 50, slots: slotsFor(0.95) },
  { id: 'parcelles', district: 'Parcelles Assainies', coords: [52, 34], price: 2000, durationMin: 40, slots: slotsFor(0.8) },
  { id: 'pikine', district: 'Pikine', coords: [68, 26], price: 1500, durationMin: 30, slots: slotsFor(1) },
  { id: 'guediawaye', district: 'Guédiawaye', coords: [62, 18], price: 1500, durationMin: 35, slots: slotsFor(0.7) },
  { id: 'rufisque', district: 'Rufisque', coords: [86, 14], price: 1000, durationMin: 25, slots: slotsFor(0.5) },
]

export function getDeparture(id: string): Departure | undefined {
  return departures.find((d) => d.id === id)
}
