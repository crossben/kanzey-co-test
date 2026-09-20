import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readWallet, addToWallet, removeFromWallet, hydrateTicket, WALLET_KEY } from './wallet'
import type { StoredTicket } from './wallet'

const billet: StoredTicket = {
  ref: 'FDM-1-PLATEAU-1700',
  slug: 'joj-dakar-2026',
  departureId: 'plateau',
  slot: '17:00',
  method: 'wave',
  purchasedAt: '2026-09-20T10:00:00.000Z',
}

beforeEach(() => localStorage.clear())

describe('readWallet', () => {
  it('retourne une liste vide au premier usage', () => {
    expect(readWallet()).toEqual([])
  })

  it('ignore un contenu corrompu plutôt que de planter', () => {
    localStorage.setItem(WALLET_KEY, 'ceci n\'est pas du JSON')
    expect(readWallet()).toEqual([])
  })

  it('ignore un JSON valide qui n\'est pas une liste', () => {
    localStorage.setItem(WALLET_KEY, '{"oups":true}')
    expect(readWallet()).toEqual([])
  })

  it('survit à un stockage indisponible', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('stockage bloqué')
    })
    expect(readWallet()).toEqual([])
    spy.mockRestore()
  })
})

describe('addToWallet', () => {
  it('ajoute un billet', () => {
    addToWallet(billet)
    expect(readWallet()).toHaveLength(1)
    expect(readWallet()[0].ref).toBe(billet.ref)
  })

  it('ne duplique pas un billet déjà présent', () => {
    addToWallet(billet)
    addToWallet(billet)
    expect(readWallet()).toHaveLength(1)
  })

  it('place le plus récent en tête', () => {
    addToWallet(billet)
    addToWallet({ ...billet, ref: 'FDM-2-X-X', slug: 'dakar-comedy-club' })
    expect(readWallet()[0].ref).toBe('FDM-2-X-X')
  })
})

describe('removeFromWallet', () => {
  it('retire le billet visé et laisse les autres', () => {
    addToWallet(billet)
    addToWallet({ ...billet, ref: 'FDM-2-X-X', slug: 'dakar-comedy-club' })
    removeFromWallet(billet.ref)
    const rest = readWallet()
    expect(rest).toHaveLength(1)
    expect(rest[0].ref).toBe('FDM-2-X-X')
  })
})

describe('hydrateTicket', () => {
  it('reconstitue la commande complète depuis le billet stocké', () => {
    const order = hydrateTicket(billet)
    expect(order?.event.slug).toBe('joj-dakar-2026')
    expect(order?.departure?.district).toBe('Plateau')
    expect(order?.total).toBe(17000)
  })

  it('retourne null si l\'événement n\'existe plus', () => {
    expect(hydrateTicket({ ...billet, slug: 'evenement-supprime' })).toBeNull()
  })
})
