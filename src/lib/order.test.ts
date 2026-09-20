import { describe, it, expect } from 'vitest'
import { buildPaymentHref, parseOrder, ticketReference } from './order'
import { getEventBySlug } from './data/events'
import { getDeparture } from './data/departures'

const event = getEventBySlug('joj-dakar-2026')!
const plateau = getDeparture('plateau')!

describe('buildPaymentHref', () => {
  it('billet seul : aucun paramètre de navette', () => {
    expect(buildPaymentHref(event)).toBe('/paiement/joj-dakar-2026')
  })

  it('billet + navette : porte le quartier et le créneau', () => {
    const href = buildPaymentHref(event, plateau, '17:00')
    expect(href).toContain('/paiement/joj-dakar-2026')
    expect(href).toContain('navette=plateau')
    expect(href).toContain('creneau=17%3A00')
  })

  it('ignore une navette sans créneau : la commande serait incomplète', () => {
    expect(buildPaymentHref(event, plateau)).toBe('/paiement/joj-dakar-2026')
  })
})

describe('parseOrder', () => {
  it('reconstruit une commande billet seul', () => {
    const order = parseOrder('joj-dakar-2026', {})
    expect(order?.event.slug).toBe('joj-dakar-2026')
    expect(order?.departure).toBeUndefined()
    expect(order?.total).toBe(15000)
  })

  it('reconstruit une commande avec navette', () => {
    const order = parseOrder('joj-dakar-2026', { navette: 'plateau', creneau: '17:00' })
    expect(order?.departure?.district).toBe('Plateau')
    expect(order?.slot).toBe('17:00')
    expect(order?.total).toBe(17000)
  })

  it('retourne null pour un événement inconnu', () => {
    expect(parseOrder('inexistant', {})).toBeNull()
  })

  it('abandonne la navette si le quartier est inconnu', () => {
    const order = parseOrder('joj-dakar-2026', { navette: 'atlantide', creneau: '17:00' })
    expect(order?.departure).toBeUndefined()
    expect(order?.total).toBe(15000)
  })

  it('abandonne la navette si le créneau n\'existe pas pour ce quartier', () => {
    const order = parseOrder('joj-dakar-2026', { navette: 'plateau', creneau: '03:00' })
    expect(order?.departure).toBeUndefined()
    expect(order?.total).toBe(15000)
  })

  it('abandonne la navette si le créneau manque', () => {
    const order = parseOrder('joj-dakar-2026', { navette: 'plateau' })
    expect(order?.departure).toBeUndefined()
  })
})

describe('ticketReference', () => {
  it('produit une référence stable pour la même commande', () => {
    const a = parseOrder('joj-dakar-2026', { navette: 'plateau', creneau: '17:00' })!
    const b = parseOrder('joj-dakar-2026', { navette: 'plateau', creneau: '17:00' })!
    expect(ticketReference(a)).toBe(ticketReference(b))
  })

  it('distingue le billet seul du pass combiné', () => {
    const seul = parseOrder('joj-dakar-2026', {})!
    const combine = parseOrder('joj-dakar-2026', { navette: 'plateau', creneau: '17:00' })!
    expect(ticketReference(seul)).not.toBe(ticketReference(combine))
  })

  it('commence par le préfixe Fodium', () => {
    const order = parseOrder('joj-dakar-2026', {})!
    expect(ticketReference(order)).toMatch(/^FDM-/)
  })
})
