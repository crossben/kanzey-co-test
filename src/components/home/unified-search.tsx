'use client'

import { useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bus, Search, Ticket as TicketIcon } from 'lucide-react'
import { searchAll } from '@/lib/search'
import { formatXOF, formatEventDate } from '@/lib/format'

/**
 * Recherche unifiée : un seul champ interroge les événements ET les trajets
 * (brief §3.2). C'est ce qui rend la double offre tangible plutôt que
 * juxtaposée.
 *
 * Motif combobox : `role="combobox"` sur le champ, `role="listbox"` sur les
 * résultats. Sans cela, un lecteur d'écran n'annonce jamais l'apparition des
 * suggestions.
 */
export function UnifiedSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchAll(query), [query])
  const showList = open && query.trim().length > 0

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        // Ne referme que si le focus quitte réellement le composant, sinon
        // cliquer un résultat le ferait disparaître avant la navigation.
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          placeholder="Un événement, une ville, un trajet…"
          aria-label="Rechercher un événement ou un trajet"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          className="h-14 w-full rounded-2xl border border-border bg-surface pl-12 pr-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {showList && (
        <div
          id={listId}
          role="listbox"
          aria-label="Résultats"
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl shadow-black/40"
        >
          {results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-muted-foreground">
              Aucun résultat pour « {query} ».
            </p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {results.map((result) =>
                result.kind === 'event' ? (
                  <li key={`e-${result.event.id}`} role="option" aria-selected={false}>
                    <Link
                      href={`/evenements/${result.event.slug}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
                    >
                      <TicketIcon className="size-4 shrink-0 text-brand" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{result.event.title}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {formatEventDate(result.event.date)} · {result.event.venue.name}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-brand-text">
                        {formatXOF(result.event.priceFrom)}
                      </span>
                    </Link>
                  </li>
                ) : (
                  <li key={`r-${result.route.id}`} role="option" aria-selected={false}>
                    <Link
                      href="/transport"
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
                    >
                      <Bus className="size-4 shrink-0 text-brand" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 truncate text-sm">
                          {result.route.from}
                          <ArrowRight className="size-3 text-muted-foreground" aria-hidden />
                          {result.route.to}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          Trajet · bientôt disponible
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-brand-text">
                        {formatXOF(result.route.price)}
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
