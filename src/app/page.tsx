import { Hero } from '@/components/home/hero'
import { UnifiedSearch } from '@/components/home/unified-search'
import { Shortcuts } from '@/components/home/shortcuts'
import { EventRail } from '@/components/home/event-rail'
import { TransportTeaser } from '@/components/home/transport-teaser'
import { events } from '@/lib/data/events'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function Home() {
  // Les plus proches d'abord : c'est l'ordre utile pour qui cherche une sortie.
  const upcoming = [...events].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-32 lg:px-6 lg:pb-24">
      <Hero />

      <section className="mt-10 lg:mt-14">
        <UnifiedSearch />
      </section>

      <section className="mt-6">
        <Shortcuts />
      </section>

      <section className="mt-16 lg:mt-24">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl leading-tight lg:text-3xl">
            À venir
          </h2>
          <Link
            href="/evenements"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tout voir
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>
        <EventRail events={upcoming} />
      </section>

      <section className="mt-16 lg:mt-24">
        <TransportTeaser />
      </section>
    </main>
  )
}
