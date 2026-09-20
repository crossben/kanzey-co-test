import { describe, it, expect } from 'vitest'
import { computeTotal, seatsLeft, soldRatio, isAlmostSoldOut } from './pricing'
import type { Event, Departure } from './types'

const event = { priceFrom: 5000 } as Event
const departure = { price: 2000 } as Departure

describe('computeTotal', () => {
  it('billet seul : retourne le prix du billet', () => {
    expect(computeTotal(event)).toBe(5000)
  })

  it('billet + navette : ajoute le prix du trajet', () => {
    expect(computeTotal(event, departure)).toBe(7000)
  })

  it('navette gratuite : le total reste celui du billet', () => {
    expect(computeTotal(event, { price: 0 } as Departure)).toBe(5000)
  })

  it('navette absente : équivaut au billet seul', () => {
    expect(computeTotal(event, undefined)).toBe(computeTotal(event))
  })
})

describe('seatsLeft', () => {
  it('soustrait les places vendues', () => {
    expect(seatsLeft({ capacity: 100, sold: 78 } as Event)).toBe(22)
  })

  it('ne descend jamais sous zéro', () => {
    expect(seatsLeft({ capacity: 100, sold: 140 } as Event)).toBe(0)
  })
})

describe('soldRatio', () => {
  it('retourne un ratio entre 0 et 1', () => {
    expect(soldRatio({ capacity: 200, sold: 50 } as Event)).toBe(0.25)
  })

  it('plafonne à 1 en cas de survente', () => {
    expect(soldRatio({ capacity: 10, sold: 15 } as Event)).toBe(1)
  })

  it('évite la division par zéro', () => {
    expect(soldRatio({ capacity: 0, sold: 0 } as Event)).toBe(0)
  })
})

describe('isAlmostSoldOut', () => {
  it('bascule à 90 %', () => {
    expect(isAlmostSoldOut({ capacity: 100, sold: 89 } as Event)).toBe(false)
    expect(isAlmostSoldOut({ capacity: 100, sold: 90 } as Event)).toBe(true)
  })
})
