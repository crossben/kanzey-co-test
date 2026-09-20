import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/**
 * Page de contrôle du design system.
 * Provisoire : remplacée par la page d'accueil en phase 3.
 */
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 p-6">
      <header className="space-y-2">
        <h1 className="font-display text-4xl leading-tight">
          Fodium — design system
        </h1>
        <p className="text-muted-foreground">
          Contrôle des tokens, des polices et du thème. Provisoire.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Typographie</h2>
        <p className="font-display text-2xl">Bricolage Grotesque — titres</p>
        <p className="font-sans">Geist Sans — texte courant</p>
        <p className="font-mono text-brand-text">Geist Mono — 15 000 XOF</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Couleurs</h2>
        <div className="flex flex-wrap gap-2">
          <div className="size-16 rounded-lg bg-brand" title="brand" />
          <div className="size-16 rounded-lg bg-brand-soft" title="brand-soft" />
          <div className="size-16 rounded-lg bg-cream" title="cream" />
          <div className="size-16 rounded-lg bg-surface ring-1 ring-border" title="surface" />
          <div className="size-16 rounded-lg bg-surface-2 ring-1 ring-border" title="surface-2" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Composants</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Acheter</Button>
          <Button variant="secondary">Billet seul</Button>
          <Button variant="outline">Détails</Button>
          <Badge>bientôt</Badge>
        </div>
      </section>
    </main>
  )
}
