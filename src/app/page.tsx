import { Ticket } from '@/components/ticket/ticket'
import { events } from '@/lib/data/events'
import { computeTotal } from '@/lib/pricing'
import { getDeparture } from '@/lib/data/departures'

/**
 * Page de contrôle du design system.
 * Provisoire : remplacée par la page d'accueil en phase 3.
 */
export default function Home() {
  const plateau = getDeparture('plateau')!

  return (
    <main className="mx-auto w-full max-w-5xl space-y-10 p-6">
      <header className="space-y-2">
        <h1 className="font-display text-4xl leading-tight">Fodium — design system</h1>
        <p className="text-muted-foreground">
          Contrôle des tokens et de la primitive Ticket. Provisoire.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Billets — variante mini</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <Ticket key={event.id} event={event} priority={i < 3} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Pass combiné — billet + navette</h2>
        <div className="max-w-md">
          <Ticket
            event={events[0]}
            variant="full"
            shuttle={{ district: plateau.district, time: '17:00' }}
            total={computeTotal(events[0], plateau)}
          />
        </div>
      </section>
    </main>
  )
}
