'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Ticket } from '@/components/ticket/ticket'
import { filterEvents } from '@/lib/filters'
import { setAmbient, DEFAULT_AMBIENT } from '@/components/home/ambient'
import { cn } from '@/lib/utils'
import type { Event } from '@/lib/types'

/**
 * Liste filtrable des événements.
 *
 * Les cartes portent la même identité de morph que sur l'accueil : ouvrir un
 * événement depuis cette page déplie le même billet, par le même mécanisme.
 * C'est ce qui rend la continuité vraie partout, et pas seulement sur le
 * chemin principal.
 */
export function EventBrowser({
  events,
  categories,
}: {
  events: Event[]
  categories: string[]
}) {
  const [category, setCategory] = useState<string | undefined>()
  const [query, setQuery] = useState('')

  const results = useMemo(
    () => filterEvents(events, { category, query }),
    [events, category, query],
  )

  const hasFilters = Boolean(category) || query.trim().length > 0

  return (
    <div className="mt-8">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrer par nom, lieu ou ville…"
          aria-label="Filtrer les événements"
          className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterChip active={!category} onClick={() => setCategory(undefined)}>
          Toutes
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
            {c}
          </FilterChip>
        ))}

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setCategory(undefined)
              setQuery('')
            }}
            className="ml-1 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" aria-hidden />
            Réinitialiser
          </button>
        )}
      </div>

      {/* `aria-live` : sans cela, un lecteur d'écran n'annonce jamais que le
          nombre de résultats a changé après un filtrage. */}
      <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">
        {results.length === 0
          ? 'Aucun événement ne correspond.'
          : `${results.length} événement${results.length > 1 ? 's' : ''}`}
      </p>

      {results.length > 0 && (
        <ul
          className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          onMouseLeave={() => setAmbient(DEFAULT_AMBIENT)}
        >
          {results.map((event, i) => (
            <li key={event.id}>
              <Link
                href={`/evenements/${event.slug}`}
                onMouseEnter={() => setAmbient(event.accent)}
                onFocus={() => setAmbient(event.accent)}
                className="block rounded-2xl outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Ticket
                  event={event}
                  priority={i < 3}
                  morphName={`ticket-${event.id}`}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
        active
          ? 'border-brand bg-accent text-brand-text'
          : 'border-border text-muted-foreground hover:border-brand/40 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
