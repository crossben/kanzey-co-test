'use client'

import { useMemo, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Bus, Moon, Ticket as TicketIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { departures } from '@/lib/data/departures'
import { subscribeWallet, walletSnapshot } from '@/lib/wallet'
import {
  parsePreferences,
  preferencesSnapshot,
  subscribePreferences,
  writePreferences,
} from '@/lib/preferences'
import { cn } from '@/lib/utils'

/**
 * Profil.
 *
 * Le brief ne note pas cet écran, mais un profil décoratif se remarque autant
 * qu'un onglet mort. Celui-ci fait deux choses réelles : il compte les billets
 * possédés, et il retient le quartier de départ habituel — qui est ensuite
 * présélectionné au moment d'ajouter une navette.
 *
 * Aucune authentification : le brief l'exclut explicitement (§6).
 */
export function ProfilePanel() {
  const walletRaw = useSyncExternalStore(subscribeWallet, walletSnapshot, () => null)
  const prefsRaw = useSyncExternalStore(subscribePreferences, preferencesSnapshot, () => null)

  const ticketCount = useMemo(() => {
    if (!walletRaw) return 0
    try {
      const parsed = JSON.parse(walletRaw)
      return Array.isArray(parsed) ? parsed.length : 0
    } catch {
      return 0
    }
  }, [walletRaw])

  const prefs = useMemo(() => parsePreferences(prefsRaw), [prefsRaw])
  const favorite = departures.find((d) => d.id === prefs.favoriteDepartureId)

  return (
    <div className="mt-8 space-y-8">
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <TicketIcon className="size-5 text-brand" aria-hidden />
          <p className="mt-3 font-mono text-3xl text-brand-text">{ticketCount}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            billet{ticketCount > 1 ? 's' : ''} sur cet appareil
          </p>
          <Link
            href="/mes-billets"
            className="mt-4 inline-flex text-sm text-brand-text underline-offset-4 hover:underline"
          >
            Voir mes billets
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <Bus className="size-5 text-brand" aria-hidden />
          <p className="mt-3 font-display text-xl leading-tight">
            {favorite ? favorite.district : 'Aucun quartier favori'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {favorite
              ? 'Présélectionné quand vous ajoutez une navette.'
              : 'Choisissez-en un pour gagner du temps à l’achat.'}
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl">Quartier de départ habituel</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Il sera présélectionné sur la page d&apos;un événement.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {departures.map((d) => {
            const active = d.id === prefs.favoriteDepartureId
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  writePreferences({
                    ...prefs,
                    // Recliquer sur le quartier actif le retire : sans cela,
                    // un choix fait une fois ne pourrait jamais être annulé.
                    favoriteDepartureId: active ? undefined : d.id,
                  })
                }
                className={cn(
                  'rounded-full border px-3.5 py-2 text-sm transition-colors',
                  active
                    ? 'border-brand bg-accent text-brand-text'
                    : 'border-border text-muted-foreground hover:border-brand/40 hover:text-foreground',
                )}
              >
                {d.district}
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl">
              <Moon className="size-4 text-brand" aria-hidden />
              Apparence
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Thème sombre par défaut.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Prototype sans authentification. Billets et préférences sont conservés
        sur cet appareil uniquement.
      </p>
    </div>
  )
}
