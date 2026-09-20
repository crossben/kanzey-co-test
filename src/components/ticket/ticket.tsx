import Image from 'next/image'
import type { Event } from '@/lib/types'
import { formatXOF, formatEventDate } from '@/lib/format'
import { Perforation } from './perforation'

export type ShuttleStub = {
  district: string
  time: string
}

type TicketProps = {
  event: Event
  /** `mini` pour les listes, `full` pour la page événement. */
  variant?: 'mini' | 'full'
  /** Souche transport : présente uniquement si le pass combiné est choisi. */
  shuttle?: ShuttleStub
  /** Total recalculé. À défaut, le prix d'entrée de l'événement est affiché. */
  total?: number
  /**
   * À activer pour les billets visibles au chargement : Next.js les
   * préchargera au lieu de les charger paresseusement, ce qui améliore le LCP.
   */
  priority?: boolean
  /** Attribut `sizes` de l'image, à ajuster selon la grille qui l'accueille. */
  sizes?: string
  className?: string
}

/**
 * Primitive de billet — l'objet central de l'interface.
 *
 * Volontairement sans état : tout passe par les props. C'est ce qui lui permet
 * de servir de carte sur l'accueil, de page sur l'événement, d'objet payé dans
 * le tunnel et de billet dans le portefeuille, sans variante ni duplication.
 */
export function Ticket({
  event,
  variant = 'mini',
  shuttle,
  total,
  priority = false,
  sizes,
  className = '',
}: TicketProps) {
  const headingId = `ticket-${event.id}-title`
  const amount = total ?? event.priceFrom

  return (
    <article
      aria-labelledby={headingId}
      className={`overflow-hidden rounded-2xl bg-surface ring-1 ring-border ${className}`}
      style={{ ['--accent' as string]: event.accent }}
    >
      <div className={`relative ${variant === 'full' ? 'h-64' : 'h-40'}`}>
        {/* Image décorative : le titre juste en dessous porte déjà
            l'information, un alt dupliqué la ferait lire deux fois. */}
        <Image
          src={event.image}
          alt=""
          fill
          priority={priority}
          sizes={
            sizes ??
            (variant === 'full'
              ? '(max-width: 640px) 100vw, 480px'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px')
          }
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs backdrop-blur">
          {event.category}
        </span>
      </div>

      <div className="space-y-1.5 p-4">
        <h3
          id={headingId}
          className={`font-display leading-tight ${variant === 'full' ? 'text-2xl' : 'text-lg'}`}
        >
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatEventDate(event.date)} · {event.venue.name}, {event.venue.city}
        </p>
        <p className="font-mono text-brand-text">{formatXOF(amount)}</p>
      </div>

      {shuttle && (
        <>
          <Perforation />
          <div
            data-testid="shuttle-stub"
            className="flex items-center justify-between gap-3 px-4 pb-4 text-sm"
          >
            <span>
              Navette · <span className="text-muted-foreground">{shuttle.district}</span>
            </span>
            <span className="font-mono text-muted-foreground">{shuttle.time}</span>
          </div>
        </>
      )}
    </article>
  )
}
