import type { ReactNode } from 'react'

/**
 * Gabarit commun des pages : largeur, gouttières, et la réserve basse qui
 * empêche la barre flottante mobile de masquer la fin du contenu.
 */
export function PageShell({
  title,
  lead,
  children,
}: {
  title: string
  lead?: string
  children?: ReactNode
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 pb-32 pt-8 lg:px-6 lg:pb-16">
      <header className="space-y-2">
        <h1 className="font-display text-3xl leading-tight lg:text-4xl">{title}</h1>
        {lead && <p className="max-w-prose text-muted-foreground">{lead}</p>}
      </header>
      {children}
    </main>
  )
}
