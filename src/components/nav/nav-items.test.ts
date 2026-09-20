import { describe, it, expect } from 'vitest'
import { NAV_ITEMS, isActive } from './nav-items'

describe('NAV_ITEMS', () => {
  it('contient les 5 accès du brief, dans l\'ordre', () => {
    expect(NAV_ITEMS.map((i) => i.label)).toEqual([
      'Accueil',
      'Événements',
      'Transport',
      'Mes billets',
      'Profil',
    ])
  })

  it('marque Transport, et lui seul, comme « bientôt »', () => {
    const soon = NAV_ITEMS.filter((i) => i.soon)
    expect(soon).toHaveLength(1)
    expect(soon[0].label).toBe('Transport')
  })

  it('donne à chaque accès une route distincte', () => {
    const hrefs = NAV_ITEMS.map((i) => i.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })
})

describe('isActive', () => {
  it('active l\'accueil uniquement sur la racine', () => {
    expect(isActive('/', '/')).toBe(true)
    expect(isActive('/evenements', '/')).toBe(false)
  })

  it('active un onglet sur ses sous-routes', () => {
    expect(isActive('/evenements/joj-dakar-2026', '/evenements')).toBe(true)
  })

  it('n\'active pas un onglet sur une autre route', () => {
    expect(isActive('/profil', '/evenements')).toBe(false)
  })
})
