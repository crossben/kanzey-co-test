import { describe, it, expect } from 'vitest'
import { searchAll, normalize } from './search'

describe('normalize', () => {
  it('ignore la casse et les accents', () => {
    expect(normalize('Événements')).toBe('evenements')
    expect(normalize('THIÈS')).toBe('thies')
  })
})

describe('searchAll', () => {
  it('ne retourne rien pour une requête vide', () => {
    expect(searchAll('')).toEqual([])
    expect(searchAll('   ')).toEqual([])
  })

  it('trouve un événement par son titre', () => {
    const res = searchAll('youssou')
    expect(res.some((r) => r.kind === 'event' && r.event.slug === 'youssou-ndour-grand-bal')).toBe(true)
  })

  it('trouve un événement sans les accents', () => {
    const res = searchAll('ceremonie')
    expect(res.some((r) => r.kind === 'event')).toBe(true)
  })

  it('trouve un événement par son lieu', () => {
    const res = searchAll('sorano')
    expect(res.filter((r) => r.kind === 'event')).not.toHaveLength(0)
  })

  it('trouve un trajet par sa destination', () => {
    const res = searchAll('saint-louis')
    expect(res.some((r) => r.kind === 'route' && r.route.to === 'Saint-Louis')).toBe(true)
  })

  it('mélange événements et trajets dans un même résultat', () => {
    // « dakar » est à la fois une ville d'événements et une origine de trajets :
    // c'est le cas qui prouve que la recherche est bien unifiée.
    const res = searchAll('dakar')
    expect(res.some((r) => r.kind === 'event')).toBe(true)
    expect(res.some((r) => r.kind === 'route')).toBe(true)
  })

  it('ne retourne rien pour une requête sans correspondance', () => {
    expect(searchAll('zzzzzz')).toEqual([])
  })

  it('limite le nombre de résultats', () => {
    expect(searchAll('a').length).toBeLessThanOrEqual(8)
  })

  it('réserve toujours de la place aux trajets, même quand les événements abondent', () => {
    // « dakar » correspond à de nombreux événements ET à tous les trajets.
    // Avec un plafond global, les trajets seraient évincés.
    const res = searchAll('dakar')
    const evts = res.filter((r) => r.kind === 'event')
    const rts = res.filter((r) => r.kind === 'route')
    expect(evts.length).toBeLessThanOrEqual(5)
    expect(rts.length).toBeGreaterThanOrEqual(1)
    expect(rts.length).toBeLessThanOrEqual(3)
  })
})
