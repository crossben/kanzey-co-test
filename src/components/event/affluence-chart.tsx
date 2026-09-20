'use client'

import { EvilBarChart } from '@/components/evilcharts/charts/recharts-bar-chart'
import type { ChartConfig } from '@/components/evilcharts/ui/recharts-chart'
import type { Slot } from '@/lib/types'

const config = {
  affluence: {
    label: 'Affluence',
    colors: { light: ['#f07f00', '#fbd7aa'], dark: ['#f07f00', '#fbd7aa'] },
  },
} satisfies ChartConfig

/**
 * Affluence prévue par créneau de navette.
 *
 * Justifié par la décision : le voyageur choisit son heure de départ, et le
 * seul critère qui lui manque est « à quel point ce départ sera chargé ».
 * Le graphique répond à ça ; une liste d'heures nues ne le fait pas.
 */
export function AffluenceChart({ slots }: { slots: Slot[] }) {
  const data = slots.map((s) => ({
    creneau: s.time,
    affluence: Math.round(s.load * 100),
  }))

  return (
    <EvilBarChart
      config={config}
      data={data}
      xDataKey="creneau"
      className="h-28 w-full"
    >
      <EvilBarChart.Bar dataKey="affluence" />
      <EvilBarChart.XAxis dataKey="creneau" />
    </EvilBarChart>
  )
}
