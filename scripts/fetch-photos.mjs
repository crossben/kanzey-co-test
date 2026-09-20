/**
 * Télécharge les photos sources depuis Unsplash vers public/events/raw/.
 * Les fichiers bruts ne sont pas versionnés : seules les versions traitées
 * par duotone.mjs partent dans le dépôt.
 */
import { writeFile, mkdir } from 'node:fs/promises'

const PHOTOS = {
  'joj':         '1665413813191-3143ec934960', // cérémonie en stade
  'fashion':     '1605289355680-75fb41239154', // défilé
  'grand-bal':   '1501386761578-eac5c94b800a', // foule en concert
  'pool-brunch': '1784407379955-087d8d0eafc4', // piscine
  'lutte':       '1774014045680-62a47ed2f759', // lutte
  'comedy':      '1558970439-add78fc68990', // scène de stand-up
}

await mkdir('public/events/raw', { recursive: true })

for (const [name, id] of Object.entries(PHOTOS)) {
  const url = `https://images.unsplash.com/photo-${id}?w=1600&q=80&fm=jpg`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${name} : HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(`public/events/raw/${name}.jpg`, buf)
  console.log(`${name.padEnd(12)} ${(buf.length / 1024).toFixed(0)} ko`)
}
