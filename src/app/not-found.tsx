import Link from 'next/link'
import { Perforation } from '@/components/ticket/perforation'

export const metadata = { title: 'Page introuvable — Fodium' }

/**
 * 404.
 *
 * Traitée comme un billet dont la souche a été détachée : l'erreur reste
 * dans le langage du produit au lieu d'en sortir.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-32 pt-16 lg:pb-16">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-text">
            Erreur 404
          </p>
          <h1 className="mt-3 font-display text-3xl leading-tight">
            Cette page n&apos;existe pas
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Le lien est peut-être périmé, ou l&apos;événement n&apos;est plus à
            l&apos;affiche.
          </p>
        </div>

        <Perforation />

        <div className="flex flex-wrap gap-4 px-6 pb-6 pt-1 text-sm">
          <Link href="/" className="text-brand-text underline-offset-4 hover:underline">
            Accueil
          </Link>
          <Link
            href="/evenements"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Voir les événements
          </Link>
          <Link
            href="/mes-billets"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Mes billets
          </Link>
        </div>
      </div>
    </main>
  )
}
