'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { DakarMap } from '@/components/map/dakar-map'
import { SoonBadge } from '@/components/nav/soon-badge'
import { departures } from '@/lib/data/departures'
import { routes } from '@/lib/data/routes'

/**
 * Section teaser de Fodium Transport sur la page d'accueil.
 *
 * C'est la zone de la « Carte Vivante » : le territoire n'apparaît que là où
 * le sujet est le transport. La même carte servira de sélecteur de point de
 * départ sur la page événement.
 */
export function TransportTeaser() {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface">
      <div className="grid items-center gap-8 p-6 lg:grid-cols-2 lg:p-10">
        <div>
          <SoonBadge />
          <h2 className="mt-4 font-display text-3xl leading-tight lg:text-4xl">
            Le trajet fait partie du billet
          </h2>
          <p className="mt-3 max-w-prose text-muted-foreground">
            Choisissez votre quartier de départ au moment d&apos;acheter votre
            place. Une navette vous dépose à l&apos;événement et vous ramène.
            Plus de négociation de taxi à la sortie, plus de retour incertain.
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-border pt-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Quartiers desservis
              </dt>
              <dd className="mt-1 font-mono text-2xl text-brand-text">
                {departures.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                Liaisons interurbaines
              </dt>
              <dd className="mt-1 font-mono text-2xl text-brand-text">
                {routes.length}
              </dd>
            </div>
          </dl>

          <Link
            href="/transport"
            className="group mt-7 inline-flex items-center gap-1.5 text-sm text-brand-text"
          >
            Voir Fodium Transport
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>

        <div className="relative">
          <DakarMap
            departures={departures}
            venue={[78, 62]}
            selectedId="mermoz"
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}
