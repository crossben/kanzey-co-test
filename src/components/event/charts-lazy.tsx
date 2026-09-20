'use client'

import dynamic from 'next/dynamic'

/**
 * Chargement différé des graphiques.
 *
 * Recharts pèse 132 ko gzippés — le plus gros module du projet. Aucun des
 * deux graphiques n'est nécessaire au premier rendu : la jauge accompagne le
 * billet, et la courbe d'affluence n'apparaît qu'après le choix d'une
 * navette. Les différer retire ce poids du chemin critique, ce qui compte sur
 * une connexion mobile.
 *
 * `ssr: false` parce que Recharts mesure le DOM pour se dimensionner : rendu
 * côté serveur, il produit un graphique de taille nulle qu'il faut ensuite
 * corriger à l'hydratation.
 *
 * Les substituts occupent exactement la hauteur finale — sans quoi le
 * contenu sauterait à l'arrivée du graphique.
 */

export const FillGaugeLazy = dynamic(
  () => import('./fill-gauge').then((m) => m.FillGauge),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-24 items-center gap-4" aria-hidden>
        <div className="size-24 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      </div>
    ),
  },
)

export const AffluenceChartLazy = dynamic(
  () => import('./affluence-chart').then((m) => m.AffluenceChart),
  {
    ssr: false,
    loading: () => <div className="h-28 w-full animate-pulse rounded-lg bg-muted" aria-hidden />,
  },
)
