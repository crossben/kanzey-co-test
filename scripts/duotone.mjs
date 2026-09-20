/**
 * Applique un duotone aux photos d'événements.
 *
 * Pourquoi au build et non en CSS : un filtre CSS se recalcule à chaque
 * repaint, ce qui saccade le scroll orchestré de la page d'accueil. Une image
 * déjà traitée coûte zéro CPU côté client.
 *
 * Pourquoi un vrai duotone et non `sharp.tint()` : `tint` applique une teinte
 * uniforme. Un duotone interpole chaque pixel entre une couleur d'ombre et
 * une couleur de lumière selon sa luminance — c'est ce qui donne l'aspect
 * « système graphique » plutôt que « photo stock colorisée ».
 *
 * La teinte de chaque image est celle de l'`accent` de son événement : les
 * visuels alimentent ainsi la bascule de couleur d'ambiance au lieu d'être
 * décoratifs.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const hex = (h) => h.replace('#', '').match(/../g).map((x) => parseInt(x, 16))
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))

const NEAR_BLACK = hex('#0a0705')
const CREAM = hex('#fff4e3')

/** accent de l'événement -> [fichier, accent] */
const IMAGES = [
  ['joj', '#f07f00'],
  ['fashion', '#d946ef'],
  ['grand-bal', '#22c55e'],
  ['pool-brunch', '#38bdf8'],
  ['lutte', '#ef4444'],
  ['comedy', '#fbbf24'],
]

await mkdir('public/events', { recursive: true })

for (const [name, accent] of IMAGES) {
  const a = hex(accent)
  // Ombres : l'accent noyé dans le noir. Lumières : l'accent éclairci vers le crème.
  const shadow = mix(NEAR_BLACK, a, 0.22)
  const light = mix(a, CREAM, 0.55)

  // out = luminance * (light - shadow) + shadow, canal par canal.
  const mult = light.map((v, i) => (v - shadow[i]) / 255)

  // Deux passes : sharp applique ses opérations dans un ordre fixe, donc
  // `linear` à 3 valeurs s'exécuterait avant l'expansion des canaux et
  // échouerait sur l'image désaturée (1 canal).
  const grey = await sharp(`public/events/raw/${name}.jpg`)
    .resize(1200, 800, { fit: 'cover', position: 'attention' })
    .greyscale()
    .linear(1.15, -12) // contraste appuyé avant colorisation
    .toColourspace('srgb')
    .png()
    .toBuffer()

  await sharp(grey)
    .linear(mult, shadow)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/events/${name}.jpg`)

  console.log(`${name.padEnd(12)} ombre rgb(${shadow}) → lumière rgb(${light})`)
}
