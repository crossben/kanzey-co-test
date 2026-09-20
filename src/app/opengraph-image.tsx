import { ImageResponse } from 'next/og'

export const alt = 'Fodium — Un billet. Une navette. Un seul geste.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Image de partage, générée à la compilation.
 *
 * Sans elle, partager un lien Fodium ne montre rien — ce qui compte pour une
 * billetterie, dont les liens circulent surtout par messagerie.
 *
 * Volontairement sans police custom : charger Bricolage Grotesque ici
 * ajouterait une dépendance réseau au build pour un gain invisible à cette
 * taille.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0a',
          padding: 72,
          color: '#fafaf9',
        }}
      >
        {/* Halo de marque */}
        <div
          style={{
            position: 'absolute',
            top: -260,
            left: 220,
            width: 760,
            height: 560,
            borderRadius: 9999,
            background: '#f07f00',
            opacity: 0.22,
            filter: 'blur(90px)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 9999,
              background: '#f07f00',
              display: 'flex',
            }}
          />
          <div style={{ fontSize: 34, letterSpacing: -0.5 }}>Fodium</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 82, lineHeight: 1.02, letterSpacing: -2.5, maxWidth: 880 }}>
            Un billet. Une navette. Un seul geste.
          </div>
          <div style={{ fontSize: 30, color: '#a1a1aa', maxWidth: 820 }}>
            Billetterie et transport au Sénégal — réservés ensemble, payés en une fois.
          </div>
        </div>

        {/* Bord perforé, comme un billet */}
        <div style={{ display: 'flex', gap: 12 }}>
          {Array.from({ length: 34 }, (_, i) => (
            <div
              key={i}
              style={{ width: 16, height: 3, borderRadius: 2, background: '#f07f00', opacity: 0.55 }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  )
}
