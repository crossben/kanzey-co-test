import { describe, it, expect } from 'vitest'
import { computeTotal } from './pricing'
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
