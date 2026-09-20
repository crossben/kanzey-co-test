import QRCode from 'qrcode'

export type QrMatrix = {
  size: number
  /** `true` = module noir. Indexé [ligne][colonne]. */
  modules: boolean[][]
}

/**
 * Matrice d'un QR code réel — pas un motif décoratif : le code est scannable.
 *
 * À n'appeler que depuis un composant serveur. La librairie `qrcode` reste
 * ainsi hors du bundle client : seule la matrice, quelques centaines de
 * booléens, est transmise au navigateur.
 */
export function qrMatrix(text: string): QrMatrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' })
  const size = qr.modules.size
  const data = qr.modules.data

  const modules: boolean[][] = []
  for (let row = 0; row < size; row++) {
    const line: boolean[] = []
    for (let col = 0; col < size; col++) line.push(Boolean(data[row * size + col]))
    modules.push(line)
  }

  return { size, modules }
}
