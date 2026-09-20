'use client'

const PREFS_KEY = 'fodium.preferences.v1'
const PREFS_EVENT = 'fodium:preferences'

export type Preferences = {
  /** Quartier de départ habituel : présélectionné à l'achat d'une navette. */
  favoriteDepartureId?: string
}

/**
 * Comme pour le portefeuille, aucun accès au stockage ne doit pouvoir casser
 * la page : navigation privée, stockage bloqué et contenu corrompu donnent
 * des préférences vides.
 */
export function readPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    return parsed as Preferences
  } catch {
    return {}
  }
}

export function writePreferences(next: Preferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next))
  } catch {
    // Perdre les préférences ne doit pas empêcher d'utiliser l'application.
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PREFS_EVENT))
}

export function subscribePreferences(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', onChange)
  window.addEventListener(PREFS_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(PREFS_EVENT, onChange)
  }
}

/** Instantané brut : `useSyncExternalStore` compare par identité. */
export function preferencesSnapshot(): string | null {
  try {
    return localStorage.getItem(PREFS_KEY)
  } catch {
    return null
  }
}

export function parsePreferences(raw: string | null): Preferences {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    return parsed as Preferences
  } catch {
    return {}
  }
}
