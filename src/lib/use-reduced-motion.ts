'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches
}

/**
 * Indique si l'utilisateur demande moins de mouvement.
 *
 * `useSyncExternalStore` plutôt qu'un `useState` dans un effet : c'est la
 * façon prévue par React de s'abonner à une source externe, sans rendu en
 * cascade — ce que le compilateur React refuse par ailleurs.
 *
 * Le serveur répond `false` : il ne connaît pas la préférence, et supposer
 * l'absence de mouvement produirait un premier rendu différent du client.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
