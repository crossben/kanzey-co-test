'use client'

import { DakarMap } from '@/components/map/dakar-map'
import { AffluenceChartLazy } from './charts-lazy'
import { formatXOF } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Departure } from '@/lib/types'

/**
 * Sélecteur de point de départ de la navette (brief §3.3).
 *
 * Délibérément pas un `<select>` : choisir un quartier est une décision
 * géographique, et une liste déroulante oblige à reconstruire mentalement la
 * carte. Ici on montre le territoire, et on double d'une liste — la carte
 * seule serait inutilisable au clavier et peu praticable au doigt.
 */
export function DeparturePicker({
  departures,
  selectedId,
  onSelect,
  slot,
  onSlotChange,
  venue,
}: {
  departures: Departure[]
  selectedId?: string
  onSelect: (id: string) => void
  slot?: string
  onSlotChange: (time: string) => void
  venue: [number, number]
}) {
  const selected = departures.find((d) => d.id === selectedId)

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface-2 p-2">
        <DakarMap
          departures={departures}
          selectedId={selectedId}
          onSelect={onSelect}
          venue={venue}
          className="w-full"
        />
      </div>

      <fieldset>
        <legend className="mb-2.5 text-sm font-medium">Votre quartier de départ</legend>
        <div className="flex flex-wrap gap-2">
          {departures.map((d) => {
            const active = d.id === selectedId
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelect(d.id)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-3.5 py-2 text-sm transition-colors',
                  active
                    ? 'border-brand bg-accent text-brand-text'
                    : 'border-border text-muted-foreground hover:border-brand/40 hover:text-foreground',
                )}
              >
                {d.district}
                <span className="ml-2 font-mono text-xs opacity-70">
                  +{formatXOF(d.price)}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {selected && (
        <fieldset>
          <legend className="mb-1 text-sm font-medium">Heure de départ</legend>
          <p className="mb-3 text-xs text-muted-foreground">
            Trajet de {selected.durationMin} min depuis {selected.district}.
            Les barres indiquent l&apos;affluence prévue.
          </p>

          <AffluenceChartLazy slots={selected.slots} />

          <div className="mt-3 flex flex-wrap gap-2">
            {selected.slots.map((s) => {
              const active = s.time === slot
              const busy = s.load >= 0.85
              return (
                <button
                  key={s.time}
                  type="button"
                  onClick={() => onSlotChange(s.time)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-lg border px-3 py-2 font-mono text-sm transition-colors',
                    active
                      ? 'border-brand bg-accent text-brand-text'
                      : 'border-border text-muted-foreground hover:border-brand/40 hover:text-foreground',
                  )}
                >
                  {s.time}
                  {busy && (
                    <span className="ml-2 font-sans text-[10px] uppercase tracking-wide text-muted-foreground">
                      chargé
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
