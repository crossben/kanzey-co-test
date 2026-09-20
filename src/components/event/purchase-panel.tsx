'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import { Check, Ticket as TicketIcon, Bus } from 'lucide-react'
import { Ticket } from '@/components/ticket/ticket'
import { Button } from '@/components/ui/button'
import { DeparturePicker } from './departure-picker'
import { FillGauge } from './fill-gauge'
import { RollingPrice, PriceAnnouncement } from './rolling-price'
import { departures } from '@/lib/data/departures'
import { computeTotal, seatsLeft } from '@/lib/pricing'
import { buildPaymentHref } from '@/lib/order'
import { formatXOF } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Event } from '@/lib/types'

/** Position du lieu sur la carte stylisée, dans le repère 0-100. */
const VENUE_POINT: [number, number] = [80, 60]

/**
 * Pass combiné — le cœur du brief §3.3.
 *
 * Deux options clairement différenciées, un sélecteur de départ qui n'apparaît
 * que si la navette est choisie, un prix qui se recalcule, et un récapitulatif
 * avant validation.
 *
 * Le billet n'est pas re-rendu sous une autre forme quand on ajoute la
 * navette : la même primitive `<Ticket>` reçoit une souche supplémentaire, et
 * c'est elle qui se déplie. L'objet reste le même — c'est tout le principe du
 * Billet Vivant.
 */
export function PurchasePanel({ event }: { event: Event }) {
  const [withShuttle, setWithShuttle] = useState(false)
  const [departureId, setDepartureId] = useState<string | undefined>()
  const [slot, setSlot] = useState<string | undefined>()
  const reduced = usePrefersReducedMotion()

  const departure = departures.find((d) => d.id === departureId)
  const activeDeparture = withShuttle ? departure : undefined
  const total = computeTotal(event, activeDeparture)

  // La navette n'est complète qu'une fois le départ ET l'heure choisis.
  const shuttleReady = Boolean(activeDeparture && slot)
  const canConfirm = !withShuttle || shuttleReady
  const soldOut = seatsLeft(event) === 0

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
      {/* Le billet, collant sur desktop : il reste visible pendant qu'on
          compose son pass, pour qu'on voie ce qu'on achète. */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Ticket
          event={event}
          variant="full"
          priority
          morphName={`ticket-${event.id}`}
          total={total}
          shuttle={
            shuttleReady
              ? { district: activeDeparture!.district, time: slot! }
              : undefined
          }
        />

        <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
          <FillGauge event={event} />
        </div>
      </div>

      <div className="space-y-8">
        <fieldset>
          <legend className="mb-3 font-display text-xl">Votre formule</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              icon={<TicketIcon className="size-5" aria-hidden />}
              title="Billet seul"
              detail="Entrée à l'événement"
              price={formatXOF(event.priceFrom)}
              active={!withShuttle}
              onClick={() => setWithShuttle(false)}
            />
            <OptionCard
              icon={<Bus className="size-5" aria-hidden />}
              title="Billet + Navette"
              detail="Aller-retour depuis votre quartier"
              price={
                departure
                  ? formatXOF(event.priceFrom + departure.price)
                  : `dès ${formatXOF(event.priceFrom + Math.min(...departures.map((d) => d.price)))}`
              }
              active={withShuttle}
              onClick={() => setWithShuttle(true)}
            />
          </div>
        </fieldset>

        {/* Le sélecteur n'existe que si la navette est choisie (brief §3.3).
            `AnimatePresence` anime aussi la SORTIE : sans lui, le bloc
            disparaîtrait d'un coup en revenant au billet seul. */}
        <AnimatePresence initial={false}>
          {withShuttle && (
            <motion.div
              key="departure"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="overflow-hidden"
            >
              <DeparturePicker
                departures={departures}
                selectedId={departureId}
                onSelect={setDepartureId}
                slot={slot}
                onSlotChange={setSlot}
                venue={VENUE_POINT}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Recap
          event={event}
          departure={activeDeparture}
          slot={shuttleReady ? slot : undefined}
          total={total}
        />

        <div className="space-y-2">
          <Button
            size="lg"
            className="w-full"
            disabled={!canConfirm || soldOut}
            aria-describedby={!canConfirm ? 'shuttle-hint' : undefined}
            asChild={canConfirm && !soldOut}
          >
            {canConfirm && !soldOut ? (
              <Link href={buildPaymentHref(event, activeDeparture, slot)}>
                Payer {formatXOF(total)}
              </Link>
            ) : (
              <span>{soldOut ? 'Complet' : `Payer ${formatXOF(total)}`}</span>
            )}
          </Button>
          {!canConfirm && (
            <p id="shuttle-hint" className="text-center text-sm text-muted-foreground">
              Choisissez un quartier de départ et une heure pour continuer.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function OptionCard({
  icon,
  title,
  detail,
  price,
  active,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  detail: string
  price: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'relative rounded-2xl border p-4 text-left transition-colors',
        active
          ? 'border-brand bg-accent'
          : 'border-border bg-surface hover:border-brand/40',
      )}
    >
      {active && (
        <Check className="absolute right-3 top-3 size-4 text-brand-text" aria-hidden />
      )}
      <span className={active ? 'text-brand-text' : 'text-muted-foreground'}>{icon}</span>
      <span className="mt-2.5 block font-medium">{title}</span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
      <span className="mt-3 block font-mono text-sm text-brand-text">{price}</span>
    </button>
  )
}

/** Récapitulatif clair avant validation (brief §3.3). */
function Recap({
  event,
  departure,
  slot,
  total,
}: {
  event: Event
  departure?: { district: string; price: number; durationMin: number }
  slot?: string
  total: number
}) {
  return (
    <section
      aria-label="Récapitulatif"
      className="rounded-2xl border border-border bg-surface p-5"
    >
      <h3 className="font-display text-lg">Récapitulatif</h3>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">Billet · {event.title}</dt>
          <dd className="shrink-0 font-mono">{formatXOF(event.priceFrom)}</dd>
        </div>

        {departure && (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">
              Navette · {departure.district}
              {slot && ` · ${slot}`}
              <span className="block text-xs opacity-70">
                aller-retour, {departure.durationMin} min
              </span>
            </dt>
            <dd className="shrink-0 font-mono">{formatXOF(departure.price)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-border pt-4">
        <span className="font-medium">Total</span>
        <span className="font-mono text-2xl text-brand-text">
          <RollingPrice value={total} />
          <PriceAnnouncement value={total} />
        </span>
      </div>
    </section>
  )
}
