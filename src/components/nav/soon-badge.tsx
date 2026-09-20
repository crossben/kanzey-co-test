import { cn } from '@/lib/utils'

/**
 * Badge « bientôt » porté par l'accès Transport.
 *
 * Le brief §3.5 impose qu'il soit « visuellement vivant, pas un simple texte
 * figé ». Les tirets défilent autour du badge comme l'anneau perforé du logo
 * Fodium — le motif dit « en cours », ce que le badge annonce.
 *
 * L'animation vit dans `globals.css` : `stroke-dashoffset` et les propriétés
 * géométriques SVG n'ont pas d'équivalent en utilitaires Tailwind.
 *
 * `cn()` fusionne les classes : sans lui, un `absolute` passé par l'appelant
 * entrerait en conflit avec le `relative` de base, et c'est l'ordre de la
 * feuille Tailwind — non l'ordre d'écriture — qui trancherait.
 */
export function SoonBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex items-center rounded-full px-2 py-0.5',
        'text-[10px] font-medium uppercase leading-none tracking-wide text-brand-text',
        className,
      )}
    >
      <svg className="soon-ring" aria-hidden focusable="false">
        <rect />
      </svg>
      <span className="soon-label relative">bientôt</span>
    </span>
  )
}
