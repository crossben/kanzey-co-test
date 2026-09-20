import { describe, it, expect } from 'vitest'
import { filterEvents } from './filters'
import { events } from './data/events'

describe('filterEvents', () => {
  it('sans critère, retourne tout, trié par date croissante', () => {
    const res = filterEvents(events, {})
    expect(res).toHaveLength(events.length)
    const dates = res.map((e) => e.date)
    expect([...dates].sort()).toEqual(dates)
  })

  it('filtre par catégorie', () => {
    const res = filterEvents(events, { category: 'Sport' })
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((e) => e.category === 'Sport')).toBe(true)
  })

  it('ignore une catégorie inconnue en ne retournant rien', () => {
    expect(filterEvents(events, { category: 'Pêche au gros' })).toEqual([])
  })

  it('filtre par texte, sans tenir compte des accents', () => {
    const res = filterEvents(events, { query: 'ceremonie' })
    expect(res.some((e) => e.slug === 'joj-dakar-2026')).toBe(true)
  })

  it('cherche aussi dans le lieu et la ville', () => {
    expect(filterEvents(events, { query: 'sorano' }).length).toBeGreaterThan(0)
    expect(filterEvents(events, { query: 'saly' }).length).toBeGreaterThan(0)
  })

  it('combine catégorie et texte', () => {
    const res = filterEvents(events, { category: 'Sport', query: 'lutte' })
    expect(res).toHaveLength(1)
    expect(res[0].slug).toBe('lutte-choc-de-lannee')
  })

  it('retourne une liste vide si rien ne correspond', () => {
    expect(filterEvents(events, { query: 'zzzzzz' })).toEqual([])
  })

  it('ne modifie pas la liste d\'origine', () => {
    const avant = events.map((e) => e.id).join()
    filterEvents(events, { category: 'Sport' })
    expect(events.map((e) => e.id).join()).toBe(avant)
  })
})
