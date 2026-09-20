'use client'

import Link from 'next/link'
import { ArrowUpRight, Bus, Ticket as TicketIcon } from 'lucide-react'
import { SoonBadge } from '@/components/nav/soon-badge'
import { useAmbientOn } from './ambient'
import { events } from '@/lib/data/events'
import { routes } from '@/lib/data/routes'

/**
 * Les deux raccourcis du brief §3.2.
 *
 * « Visuellement distincts » est pris au mot : ils ne diffèrent pas seulement
 * par le libellé mais par la matière — trame de perforations pour la
 * billetterie, trame de routes pour le transport.
 */
export function Shortcuts() {
  const eventsAmbient = useAmbientOn('#f07f00')
  const transportAmbient = useAmbientOn('#38bdf8')

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/evenements"
        {...eventsAmbient}
        className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand/50"
      >
        {/* Trame de perforations — l'idiome du billet */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-[0.07] transition-opacity group-hover:opacity-[0.14]"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, currentColor 1.5px, transparent 1.6px)',
            backgroundSize: '14px 14px',
            color: '#f07f00',
          }}
        />
        <div className="relative">
          <TicketIcon className="size-7 text-brand" aria-hidden />
          <h3 className="mt-4 font-display text-2xl leading-tight">Événements</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {events.length} à venir à Dakar et au Sénégal
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand-text">
            Parcourir
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </Link>

      <Link
        href="/transport"
        {...transportAmbient}
        className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-sky-400/50"
      >
        {/* Trame de routes — l'idiome du territoire */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-[0.09] transition-opacity group-hover:opacity-[0.18]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, currentColor 0 1px, transparent 1px 22px)',
            color: '#38bdf8',
          }}
        />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <Bus className="size-7 text-sky-400" aria-hidden />
            <SoonBadge />
          </div>
          <h3 className="mt-4 font-display text-2xl leading-tight">Transport</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Navettes événementielles · {routes.length} liaisons interurbaines
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-sky-400">
            Découvrir
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </Link>
    </div>
  )
}
