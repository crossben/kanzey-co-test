'use client'

import { motion } from 'motion/react'
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion'
import type { QrMatrix } from '@/lib/qr'

/**
 * Rendu d'un QR code réel.
 *
 * La matrice est calculée côté serveur : ce composant ne reçoit que des
 * booléens, la librairie d'encodage ne part pas dans le bundle client.
 *
 * `animate` fait apparaître le code par balayage, comme une impression. On
 * révèle par un masque plutôt qu'en animant les ~440 modules un à un : une
 * seule propriété animée au lieu de plusieurs centaines d'éléments.
 */
export function QrCode({
  matrix,
  animate = false,
  className = '',
  label = 'Code de validation du billet',
}: {
  matrix: QrMatrix
  animate?: boolean
  className?: string
  label?: string
}) {
  const reduced = usePrefersReducedMotion()
  const { size, modules } = matrix
  const shouldAnimate = animate && !reduced

  return (
    <svg
      viewBox={`-1 -1 ${size + 2} ${size + 2}`}
      className={className}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
    >
      {/* Marge blanche : sans elle, un lecteur de QR ne détecte pas le code. */}
      <rect x={-1} y={-1} width={size + 2} height={size + 2} fill="#ffffff" />

      <defs>
        <clipPath id={`qr-reveal-${size}`}>
          <motion.rect
            x={-1}
            y={-1}
            width={size + 2}
            height={size + 2}
            initial={shouldAnimate ? { scaleY: 0 } : false}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ originY: 0, transformOrigin: 'top' }}
          />
        </clipPath>
      </defs>

      <g clipPath={`url(#qr-reveal-${size})`} fill="#141414">
        {modules.map((row, r) =>
          row.map((on, c) =>
            on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} /> : null,
          ),
        )}
      </g>
    </svg>
  )
}
