import { notFound } from 'next/navigation'
import { Ticket } from '@/components/ticket/ticket'
import { PageShell } from '@/components/page-shell'
import { events, getEventBySlug } from '@/lib/data/events'

/** Génère les 6 pages à la compilation : aucune n'est rendue à la demande. */
export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: PageProps<'/evenements/[slug]'>) {
  const { slug } = await params
  const event = getEventBySlug(slug)
  return { title: event ? `${event.title} — Fodium` : 'Événement — Fodium' }
}

export default async function EvenementPage({ params }: PageProps<'/evenements/[slug]'>) {
  const { slug } = await params
  const event = getEventBySlug(slug)
  if (!event) notFound()

  return (
    <PageShell title={event.title}>
      <div className="mt-8 max-w-md">
        <Ticket event={event} variant="full" priority />
      </div>
    </PageShell>
  )
}
