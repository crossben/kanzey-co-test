'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(SplitText, useGSAP)

/**
 * Hero typographique.
 *
 * Le titre est découpé en caractères par SplitText puis révélé en cascade.
 * Pourquoi pas du CSS : il faudrait écrire un `<span>` et un délai par
 * caractère à la main dans le JSX, ce qui abîme le texte pour les lecteurs
 * d'écran et rend le libellé impossible à modifier sans refaire l'animation.
 * SplitText découpe au runtime et restaure le DOM d'origine au démontage.
 */
export function Hero() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // `matchMedia` de GSAP nettoie automatiquement quand la préférence
      // change : l'animation n'existe tout simplement pas si l'utilisateur
      // demande moins de mouvement.
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = root.current?.querySelector<HTMLElement>('[data-hero-title]')
        if (!title) return

        // `autoSplit` re-découpe automatiquement quand la police définitive
        // remplace la police de repli, et `onSplit` rejoue l'animation sur le
        // nouveau découpage. Sans cela, il faudrait attendre
        // `document.fonts.ready` — et donc retarder l'entrée du titre.
        const split = SplitText.create(title, {
          type: 'chars,words',
          mask: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 120,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: { each: 0.018, from: 'start' },
            }),
        })

        gsap.from('[data-hero-fade]', {
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.09,
          delay: 0.35,
        })

        return () => split.revert()
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="relative pt-10 lg:pt-20">
      <p
        data-hero-fade
        className="font-mono text-xs uppercase tracking-[0.2em] text-brand-text"
      >
        Billetterie &amp; Transport · Sénégal
      </p>

      <h1
        data-hero-title
        className="mt-5 max-w-[15ch] font-display text-[clamp(2.6rem,9vw,5.5rem)] font-semibold leading-[0.95] tracking-tight"
      >
        Un billet. Une navette. Un seul geste.
      </h1>

      <p
        data-hero-fade
        className="mt-6 max-w-prose text-base text-muted-foreground lg:text-lg"
      >
        Fodium réunit l&apos;entrée à l&apos;événement et le trajet pour y
        aller. Choisis ensemble, payés en une fois, sur un seul pass.
      </p>
    </div>
  )
}
