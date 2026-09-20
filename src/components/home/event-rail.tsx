'use client'

import { useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Ticket } from '@/components/ticket/ticket'
import type { Event } from '@/lib/types'
import { DEFAULT_AMBIENT, setAmbient } from './ambient'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Liste des événements à venir (brief §3.2, minimum 3 cartes).
 *
 * Chaque carte EST un billet : c'est le même composant `<Ticket>` qui servira
 * de page à l'étape suivante, ce qui rend le morph possible.
 *
 * Deux comportements pilotés par ScrollTrigger :
 *   1. l'entrée en cascade, déclenchée à l'approche de la section ;
 *   2. la couleur d'ambiance, qui suit la carte la plus proche du centre de
 *      l'écran — indispensable sur mobile, où le survol n'existe pas.
 */
export function EventRail({ events }: { events: Event[] }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-event-card]')
      if (cards.length === 0) return

      const mm = gsap.matchMedia()

      // L'entrée est décorative : on ne la joue pas si l'utilisateur demande
      // moins de mouvement. Les cartes restent alors simplement visibles.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(cards, {
          y: 48,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 78%',
            once: true,
          },
        })
      })

      // La couleur d'ambiance n'est pas décorative : elle informe de la carte
      // active. Elle reste donc branchée quelle que soit la préférence.
      const triggers = cards.map((card) =>
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: ({ isActive }) => {
            if (isActive) setAmbient(card.dataset.accent ?? DEFAULT_AMBIENT)
          },
        }),
      )

      return () => triggers.forEach((t) => t.kill())
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      onMouseLeave={() => setAmbient(DEFAULT_AMBIENT)}
    >
      {events.map((event, i) => (
        <Link
          key={event.id}
          href={`/evenements/${event.slug}`}
          data-event-card
          data-accent={event.accent}
          onMouseEnter={() => setAmbient(event.accent)}
          onFocus={() => setAmbient(event.accent)}
          className="rounded-2xl outline-none transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Ticket event={event} priority={i < 3} />
        </Link>
      ))}
    </div>
  )
}
