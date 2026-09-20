'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { PAYMENT_METHODS } from '@/lib/data/payment-methods'
import type { PaymentMethod } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * Choix du moyen de paiement, traité comme un objet et non comme une option
 * de formulaire (brief §3.4).
 *
 * Les jetons portent les couleurs des opérateurs : on reconnaît Wave ou
 * Orange Money avant même de lire le libellé, ce qu'une liste déroulante
 * interdit par construction.
 */
export function PaymentMethods({
  selected,
  onSelect,
}: {
  selected?: PaymentMethod
  onSelect: (id: PaymentMethod) => void
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-xl">Comment payez-vous ?</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PAYMENT_METHODS.map((method) => {
          const active = method.id === selected
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              aria-pressed={active}
              className={cn(
                'group relative aspect-[4/3] overflow-hidden rounded-2xl p-3 text-left transition-transform',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                active ? 'ring-2 ring-brand' : 'hover:-translate-y-0.5',
              )}
              style={{
                background: `linear-gradient(145deg, ${method.from}, ${method.to})`,
                color: method.ink,
              }}
            >
              {/* Trame de perforations : le jeton appartient au même monde
                  graphique que le billet. */}
              <span
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at center, currentColor 1px, transparent 1.1px)',
                  backgroundSize: '10px 10px',
                }}
              />
              {active && <Check className="absolute right-2.5 top-2.5 size-4" aria-hidden />}

              <span className="relative flex h-full flex-col justify-end">
                <span className="text-sm font-semibold leading-tight">{method.label}</span>
                <span className="mt-0.5 text-[11px] leading-snug opacity-80">
                  {method.hint}
                </span>
              </span>

              {active && (
                <motion.span
                  layoutId="payment-token-ring"
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-white/50"
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
