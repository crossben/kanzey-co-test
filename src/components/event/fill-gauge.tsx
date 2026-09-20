'use client'

import { EvilRadialChart } from '@/components/evilcharts/charts/recharts-radial-chart'
import type { ChartConfig } from '@/components/evilcharts/ui/recharts-chart'
import { seatsLeft, soldRatio } from '@/lib/pricing'
import type { Event } from '@/lib/types'

// `colors` attend un tableau par thème : les entrées successives forment un
// dégradé. Orange de marque vers pêche, identique en clair et en sombre —
// l'orange est l'ancre de marque dans les deux thèmes.
const config = {
  vendu: {
    label: 'Vendu',
    colors: { light: ['#f07f00', '#fbd7aa'], dark: ['#f07f00', '#fbd7aa'] },
  },
} satisfies ChartConfig

/**
 * Jauge de remplissage de l'événement.
 *
 * Un graphique n'est justifié que s'il informe la décision d'achat. Ici il
 * répond à « dois-je me dépêcher ? » — ce qu'une phrase seule fait moins bien
 * qu'un arc qu'on lit d'un coup d'œil.
 *
 * `max={100}` est indispensable : sans lui l'échelle se déduit des données et
 * la barre remplit toujours l'arc, ce qui rendrait la jauge fausse.
 */
export function FillGauge({ event }: { event: Event }) {
  const percent = Math.round(soldRatio(event) * 100)
  const left = seatsLeft(event)

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-24 shrink-0">
        <EvilRadialChart
          config={config}
          data={[{ name: 'vendu', vendu: percent }]}
          nameKey="name"
          variant="semi"
          max={100}
          innerRadius="66%"
          outerRadius="100%"
          className="size-24"
        >
          <EvilRadialChart.RadialBar dataKey="vendu" />
        </EvilRadialChart>
        <span className="pointer-events-none absolute inset-x-0 bottom-1 text-center font-mono text-sm text-brand-text">
          {percent} %
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium">
          {left === 0 ? 'Complet' : `Plus que ${left.toLocaleString('fr-FR')} places`}
        </p>
        <p className="text-xs text-muted-foreground">
          sur {event.capacity.toLocaleString('fr-FR')} au total
        </p>
      </div>
    </div>
  )
}
