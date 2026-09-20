import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { PurchasePanel } from '@/components/event/purchase-panel'
import { events, getEventBySlug } from '@/lib/data/events'
import { formatEventDate } from '@/lib/format'
import { isAlmostSoldOut } from '@/lib/pricing'

/**
 * Les 6 pages sont générées à la compilation.
 *
 * Ce n'est pas qu'une optimisation : le morph inter-pages n'a lieu que si la
 * destination se rend dans le même commit que la navigation, ce qui suppose
 * qu'elle soit préchargée. Une page rendue à la demande afficherait d'abord
 * un état de chargement et casserait la continuité du billet.
 */
export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: PageProps<'/evenements/[slug]'>) {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) return { title: 'Événement introuvable — Fodium' }

  return {
    title: `${event.title} — Fodium`,
    description: `${formatEventDate(event.date)} · ${event.venue.name}, ${event.venue.city}. Billet seul ou billet + navette.`,
  }
}

export default async function EvenementPage({ params }: PageProps<'/evenements/[slug]'>) {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) notFound()

  return (
    <main
      className="mx-auto w-full max-w-6xl px-5 pb-32 pt-6 lg:px-6 lg:pb-24 lg:pt-10"
      style={{ ['--event-accent' as string]: event.accent }}
    >
      <Link
        href="/evenements"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Tous les événements
      </Link>

      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-1 text-xs">
            {event.category}
          </span>
          {isAlmostSoldOut(event) && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs text-brand-text">
              Presque complet
            </span>
          )}
        </div>

        <h1 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.5rem)] font-semibold leading-[1.05] tracking-tight">
          {event.title}
        </h1>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden />
            {formatEventDate(event.date)}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4" aria-hidden />
            {event.venue.name}, {event.venue.city}
          </span>
        </div>
      </header>

      <div className="mt-10 lg:mt-14">
        <PurchasePanel event={event} />
      </div>
    </main>
  )
}
