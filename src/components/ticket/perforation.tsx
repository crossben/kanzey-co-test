/**
 * Bord perforé séparant les souches d'un billet.
 *
 * Dérivé de l'anneau perforé du logo Fodium : la marque encode déjà le motif
 * du billet déchirable, on ne l'invente pas.
 *
 * Les encoches sont des disques de la couleur du fond de page, posés à cheval
 * sur les bords du billet — c'est ce qui donne l'illusion d'une découpe réelle
 * sans masque CSS, qui casserait le `ring` du billet.
 */
export function Perforation({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`relative h-6 w-full ${className}`}>
      {/* Encoche gauche */}
      <div className="absolute left-0 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-1 ring-border" />
      {/* Encoche droite */}
      <div className="absolute right-0 top-1/2 size-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-background ring-1 ring-border" />
      {/* Ligne de déchirure */}
      <div
        className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 text-muted-foreground/50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to right, currentColor 0 6px, transparent 6px 12px)',
        }}
      />
    </div>
  )
}
