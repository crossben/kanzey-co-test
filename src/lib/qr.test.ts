import { describe, it, expect } from 'vitest'
import { qrMatrix } from './qr'

describe('qrMatrix', () => {
  it('produit une matrice carrée', () => {
    const { size, modules } = qrMatrix('FDM-1-X-X')
    expect(modules).toHaveLength(size)
    for (const row of modules) expect(row).toHaveLength(size)
  })

  it('place les trois repères de position aux coins', () => {
    // Un repère de position est un motif 7x7 fixe : anneau plein, bordure
    // blanche, carré plein central. C'est l'invariante qui rend un QR
    // détectable — bien plus significative que la valeur d'un module isolé.
    const { size, modules } = qrMatrix('FDM-1-X-X')
    const FINDER = [
      'XXXXXXX',
      'X.....X',
      'X.XXX.X',
      'X.XXX.X',
      'X.XXX.X',
      'X.....X',
      'XXXXXXX',
    ]
    const readFinder = (top: number, left: number) =>
      Array.from({ length: 7 }, (_, r) =>
        Array.from({ length: 7 }, (_, c) => (modules[top + r][left + c] ? 'X' : '.')).join(''),
      )

    expect(readFinder(0, 0)).toEqual(FINDER)              // haut-gauche
    expect(readFinder(0, size - 7)).toEqual(FINDER)        // haut-droite
    expect(readFinder(size - 7, 0)).toEqual(FINDER)        // bas-gauche
  })

  it('encode des contenus différents différemment', () => {
    const a = qrMatrix('FDM-1-X-X')
    const b = qrMatrix('FDM-1-PLATEAU-1700')
    expect(JSON.stringify(a.modules)).not.toBe(JSON.stringify(b.modules))
  })
})
