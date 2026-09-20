import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readPreferences, writePreferences, parsePreferences } from './preferences'

beforeEach(() => localStorage.clear())

describe('préférences', () => {
  it('sont vides au premier usage', () => {
    expect(readPreferences()).toEqual({})
  })

  it('conservent le quartier favori', () => {
    writePreferences({ favoriteDepartureId: 'plateau' })
    expect(readPreferences().favoriteDepartureId).toBe('plateau')
  })

  it('ignorent un contenu corrompu', () => {
    localStorage.setItem('fodium.preferences.v1', 'pas du JSON')
    expect(readPreferences()).toEqual({})
  })

  it('ignorent un JSON valide qui n\'est pas un objet', () => {
    localStorage.setItem('fodium.preferences.v1', '[1,2,3]')
    expect(readPreferences()).toEqual({})
  })

  it('survivent à un stockage indisponible', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqué')
    })
    expect(readPreferences()).toEqual({})
    spy.mockRestore()
  })
})

describe('parsePreferences', () => {
  it('gère l\'absence de valeur', () => {
    expect(parsePreferences(null)).toEqual({})
  })

  it('relit ce qui a été écrit', () => {
    expect(parsePreferences('{"favoriteDepartureId":"pikine"}').favoriteDepartureId).toBe('pikine')
  })
})
