'use client'

import { useCallback } from 'react'

/** Couleur d'ambiance par défaut : l'orange de marque. */
export const DEFAULT_AMBIENT = '#f07f00'

/**
 * Applique la couleur d'ambiance.
 *
 * Écrit directement sur `documentElement` plutôt que de passer par un état
 * React : la couleur change à chaque défilement, et un état déclencherait un
 * re-rendu de toute la page à chaque image. La transition est portée par le
 * CSS (`@property --ambient`), pas par JavaScript.
 */
export function setAmbient(color: string): void {
  document.documentElement.style.setProperty('--ambient', color)
}

/** Halo de fond qui suit la couleur d'ambiance. Purement décoratif. */
export function AmbientBackdrop() {
  return <div aria-hidden className="ambient-backdrop" />
}

/** Pose une couleur au survol/focus, la rend au départ. */
export function useAmbientOn(color: string) {
  const enter = useCallback(() => setAmbient(color), [color])
  const leave = useCallback(() => setAmbient(DEFAULT_AMBIENT), [])
  return { onMouseEnter: enter, onFocus: enter, onMouseLeave: leave, onBlur: leave }
}
