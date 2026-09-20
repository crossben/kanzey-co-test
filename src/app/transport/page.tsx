import { PageShell } from '@/components/page-shell'
import { SoonBadge } from '@/components/nav/soon-badge'
import { routes } from '@/lib/data/routes'
import { departures } from '@/lib/data/departures'
import { formatXOF } from '@/lib/format'
import { ArrowRight, Bus, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Transport — Fodium',
  description:
    'Navettes événementielles et trajets interurbains. Bientôt disponible.',
}

/** Formate une durée en minutes vers « 1 h 30 » ou « 45 min ». */
function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m}`
}

export default function TransportPage() {
  return (
    <PageShell
      title="Fodium Transport"
      lead="Une navette jusqu'à l'événement, et des liaisons entre les villes. Réservées en même temps que votre billet."
    >
      <div className="mt-4">
        <SoonBadge />
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-border bg-surface p-5">
          <Bus className="size-6 text-brand" aria-hidden />
          <h2 className="mt-3 font-display text-xl">Navettes événementielles</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Un aller-retour depuis votre quartier jusqu&apos;au lieu de
            l&apos;événement. Choisi au moment de l&apos;achat du billet, sur
            un seul pass.
          </p>
          <p className="mt-4 font-mono text-sm text-brand-text">
            {departures.length} quartiers desservis
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-surface p-5">
          <MapPin className="size-6 text-brand" aria-hidden />
          <h2 className="mt-3 font-display text-xl">Trajets interurbains</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Dakar, Thiès, Saint-Louis, Touba, Ziguinchor. Départs quotidiens,
            places numérotées, billet au même format.
          </p>
          <p className="mt-4 font-mono text-sm text-brand-text">
            {routes.length} liaisons au lancement
          </p>
        </article>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl">Liaisons prévues</h2>
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {routes.map((route) => (
            <li
              key={route.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-4 text-sm"
            >
              <span className="flex items-center gap-2 font-medium">
                {route.from}
                <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden />
                {route.to}
              </span>
              <span className="text-muted-foreground">
                {formatDuration(route.durationMin)} · {route.distanceKm} km
              </span>
              <span className="ml-auto font-mono text-brand-text">
                {formatXOF(route.price)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Tarifs indicatifs. L&apos;ouverture du service sera annoncée sur cette
          page.
        </p>
      </section>
    </PageShell>
  )
}
