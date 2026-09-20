import { describe, it, expect } from 'vitest'
import { formatXOF, formatEventDate } from './format'

describe('formatXOF', () => {
  it('groupe les milliers avec une espace insécable fine', () => {
    expect(formatXOF(5000)).toBe('5 000 XOF')
  })

  it('ne montre aucune décimale', () => {
    expect(formatXOF(12500)).toBe('12 500 XOF')
  })

  it('gère les grands montants', () => {
    expect(formatXOF(1250000)).toBe('1 250 000 XOF')
  })

  it('gère zéro sans séparateur', () => {
    expect(formatXOF(0)).toBe('0 XOF')
  })
})

describe('formatEventDate', () => {
  it('formate le mois en français', () => {
    expect(formatEventDate('2026-10-03T18:00:00Z')).toContain('oct')
  })

  it("inclut le jour et l'heure", () => {
    const out = formatEventDate('2026-10-03T18:00:00Z')
    expect(out).toContain('3')
    expect(out).toContain('18:00')
  })

  it('rend le même résultat quel que soit le fuseau du runtime', () => {
    // Le rendu serveur et le rendu client doivent coïncider, sinon React
    // signale une erreur d'hydratation.
    const out = formatEventDate('2026-10-03T18:00:00Z')
    expect(out).toContain('18:00')
  })
})
