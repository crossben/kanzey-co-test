import { PageShell } from '@/components/page-shell'
import { EventBrowser } from '@/components/events/event-browser'
import { events, categories } from '@/lib/data/events'

export const metadata = {
  title: 'Événements — Fodium',
  description: 'Tous les événements à venir à Dakar et au Sénégal.',
}

export default function EvenementsPage() {
  return (
    <PageShell
      title="Événements"
      lead="Tous les événements à venir à Dakar et au Sénégal. Billet seul ou billet + navette."
    >
      <EventBrowser events={events} categories={categories} />
    </PageShell>
  )
}
