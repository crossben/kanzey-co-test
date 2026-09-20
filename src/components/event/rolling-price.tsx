'use client'

import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react'
import { formatXOF } from '@/lib/format'

/**
 * Prix qui roule jusqu'à sa nouvelle valeur.
 *
 * Le brief §3.3 exige que le total « se recalcule dynamiquement ». Un simple
 * remplacement de chiffre rend ce recalcul invisible : l'œil ne voit pas que
 * la valeur a changé, seulement qu'elle est différente. L'interpolation rend
 * le lien de cause à effet perceptible.
 *
 * La valeur est portée par une MotionValue : elle s'anime hors du cycle de
 * rendu React, sans déclencher de re-rendu à chaque image.
 */
export function RollingPrice({
  value,
  className = '',
}: {
  value: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const amount = useMotionValue(value)
  const label = useTransform(amount, (v) => formatXOF(Math.round(v)))

  useEffect(() => {
    if (reduced) {
      amount.set(value)
      return
    }
    const controls = animate(amount, value, {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [value, amount, reduced])

  return (
    <motion.span className={className} aria-hidden>
      {label}
    </motion.span>
  )
}

/**
 * Version accessible : le montant animé est masqué aux lecteurs d'écran, et
 * la valeur réelle est annoncée ici. Sans cela, un lecteur d'écran tenterait
 * de lire chaque valeur intermédiaire du roulement.
 */
export function PriceAnnouncement({ value }: { value: number }) {
  return (
    <span className="sr-only" aria-live="polite">
      Total : {formatXOF(value)}
    </span>
  )
}
