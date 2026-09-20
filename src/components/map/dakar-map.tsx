'use client'

import type { Departure } from '@/lib/types'

/**
 * Carte stylisée de l'agglomération dakaroise.
 *
 * Volontairement un SVG dessiné, pas une carte à tuiles : MapLibre coûterait
 * ~200 ko plus des requêtes réseau pour afficher une dizaine de points fixes,
 * et imposerait son propre rendu graphique. Ici le tracé suit le système
 * visuel du reste du site, et pèse quelques kilo-octets.
 *
 * Le repère est le viewBox `0 0 100 100`, pas des coordonnées géographiques :
 * les positions respectent la géographie relative sans prétendre à une
 * projection.
 */

/** Silhouette de la presqu'île du Cap-Vert, simplifiée. */
const LANDMASS =
  'M12 50 C14 40 24 33 36 31 C46 22 60 10 78 7 C90 5 97 11 95 20 C93 30 84 35 77 41 C71 52 77 62 74 74 C71 85 60 88 54 81 C46 72 36 73 28 67 C19 62 10 59 12 50 Z'

/** Marqueur hexagonal — repris des hexagones imbriqués du logo Fodium. */
function Hexagon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const points = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')
  return <polygon points={points} />
}

export type DakarMapProps = {
  departures: Departure[]
  /** Départ retenu. */
  selectedId?: string
  onSelect?: (id: string) => void
  /** Position du lieu de l'événement, dans le même repère 0-100. */
  venue?: [number, number]
  className?: string
}

export function DakarMap({
  departures,
  selectedId,
  onSelect,
  venue,
  className = '',
}: DakarMapProps) {
  const selected = departures.find((d) => d.id === selectedId)
  const interactive = Boolean(onSelect)

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={interactive ? 'group' : 'img'}
      aria-label={interactive ? undefined : "Carte des quartiers desservis à Dakar"}
    >
      <path d={LANDMASS} className="fill-surface-2 stroke-border" strokeWidth="0.6" />

      {/* Trajet depuis le départ retenu jusqu'au lieu */}
      {venue && selected && (
        <line
          x1={selected.coords[0]}
          y1={selected.coords[1]}
          x2={venue[0]}
          y2={venue[1]}
          className="stroke-brand"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeDasharray="2.5 2"
        />
      )}

      {venue && (
        <g className="fill-brand">
          <circle cx={venue[0]} cy={venue[1]} r="2.4" />
          <circle cx={venue[0]} cy={venue[1]} r="4.6" className="fill-brand/25" />
        </g>
      )}

      {departures.map((d) => {
        const active = d.id === selectedId
        const [cx, cy] = d.coords

        const marker = (
          <g
            className={
              active
                ? 'fill-brand stroke-brand'
                : 'fill-surface stroke-muted-foreground/60 hover:stroke-brand'
            }
            strokeWidth="0.5"
          >
            <Hexagon cx={cx} cy={cy} r={active ? 3.4 : 2.6} />
          </g>
        )

        if (!interactive) return <g key={d.id}>{marker}</g>

        return (
          <g
            key={d.id}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            aria-label={`Départ depuis ${d.district}`}
            className="cursor-pointer outline-none"
            onClick={() => onSelect?.(d.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect?.(d.id)
              }
            }}
          >
            {/* Cible de clic élargie : un hexagone de 2,6 unités est trop
                petit pour le doigt une fois la carte rendue. */}
            <circle cx={cx} cy={cy} r="6" fill="transparent" />
            {marker}
          </g>
        )
      })}
    </svg>
  )
}
