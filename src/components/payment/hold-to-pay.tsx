'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useMotionValue } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import type { AnimationPlaybackControls } from 'motion/react'

/** Nombre de segments de l'anneau — repris de l'anneau perforé du logo. */
const SEGMENTS = 28
/** Durée du maintien. Assez long pour être délibéré, assez court pour ne pas lasser. */
const HOLD_MS = 1300

type Phase = 'idle' | 'holding' | 'done'

/**
 * Validation par maintien — le cœur du parcours réinventé (brief §3.4).
 *
 * Ce que ça remplace : un bouton « Payer », puis un écran de confirmation,
 * puis une redirection vers l'application de l'opérateur. Trois ruptures de
 * contexte pour une seule intention.
 *
 * Pourquoi un maintien : la durée EST la confirmation. Un appui accidentel
 * ne valide rien, donc l'écran « êtes-vous sûr ? » devient inutile. Et
 * l'anneau qui se remplit dit en continu où l'on en est, ce qu'un bouton
 * pressé ne dit jamais.
 *
 * Accessibilité : le maintien est une amélioration, pas une condition. Au
 * clavier, la touche Entrée ou Espace valide directement — maintenir une
 * touche n'est pas un geste fiable selon les technologies d'assistance.
 */
export function HoldToPay({
  amount,
  disabled,
  onComplete,
}: {
  amount: string
  disabled?: boolean
  onComplete: () => void
}) {
  const [phase, setPhase] = useState<Phase>('idle')
  const progress = useMotionValue(0)
  const ringRef = useRef<SVGGElement>(null)
  const runRef = useRef<AnimationPlaybackControls | null>(null)
  const reduced = usePrefersReducedMotion()

  // Les segments sont peints directement dans le DOM : passer par un état
  // React re-rendrait tout le composant à chaque image de l'animation.
  useEffect(() => {
    const paint = (value: number) => {
      const lit = value * SEGMENTS
      const nodes = ringRef.current?.children
      if (!nodes) return
      for (let i = 0; i < nodes.length; i++) {
        const on = i < lit
        ;(nodes[i] as SVGElement).style.opacity = on ? '1' : '0.12'
      }
    }
    paint(progress.get())
    return progress.on('change', paint)
  }, [progress])

  const finish = () => {
    setPhase('done')
    onComplete()
  }

  const start = () => {
    if (disabled || phase === 'done') return
    setPhase('holding')
    runRef.current?.stop()
    runRef.current = animate(progress, 1, {
      duration: HOLD_MS / 1000,
      ease: 'linear',
      onComplete: finish,
    })
  }

  const cancel = () => {
    if (phase !== 'holding') return
    runRef.current?.stop()
    runRef.current = animate(progress, 0, { duration: 0.28, ease: 'easeOut' })
    setPhase('idle')
  }

  /** Validation directe : clavier, ou préférence de mouvement réduit. */
  const confirmNow = () => {
    if (disabled || phase === 'done') return
    runRef.current?.stop()
    progress.set(1)
    finish()
  }

  const busy = phase === 'holding'

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        disabled={disabled || phase === 'done'}
        onPointerDown={reduced ? undefined : start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            confirmNow()
          }
        }}
        onClick={reduced ? confirmNow : undefined}
        aria-label={
          reduced
            ? `Payer ${amount}`
            : `Maintenir pour payer ${amount}. Entrée valide directement.`
        }
        className="relative grid size-44 select-none place-items-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 active:scale-[0.98]"
        style={{ touchAction: 'none' }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
          <g ref={ringRef}>
            {Array.from({ length: SEGMENTS }, (_, i) => {
              const a = (360 / SEGMENTS) * i
              return (
                <rect
                  key={i}
                  x="47.3"
                  y="2"
                  width="5.4"
                  height="10"
                  rx="1.2"
                  className="fill-brand"
                  style={{ opacity: 0.12, transformOrigin: '50px 50px', transform: `rotate(${a}deg)` }}
                />
              )
            })}
          </g>
        </svg>

        <span className="relative flex flex-col items-center gap-1 px-6 text-center">
          <span className="font-display text-lg leading-tight">
            {phase === 'done'
              ? 'Validé'
              : busy
                ? 'Continuez…'
                : reduced
                  ? 'Payer'
                  : 'Maintenir'}
          </span>
          <span className="font-mono text-sm text-brand-text">{amount}</span>
        </span>
      </button>

      {!reduced && (
        <>
          <p className="max-w-[24ch] text-center text-xs text-muted-foreground">
            Gardez le doigt appuyé jusqu&apos;à ce que l&apos;anneau se referme.
          </p>

          {/* Alternative explicite : le geste ne doit jamais être la seule
              voie d'accès au paiement. */}
          <button
            type="button"
            onClick={confirmNow}
            disabled={disabled || phase === 'done'}
            className="text-sm text-muted-foreground underline-offset-4 outline-none transition-colors hover:text-foreground focus-visible:underline disabled:opacity-50"
          >
            Valider sans maintenir
          </button>
        </>
      )}
    </div>
  )
}
