# Fodium — Billetterie & Transport

Prototype frontend réalisé dans le cadre du challenge Fodium / Kanzey.co.

Reconception de la page d'accueil autour de la double offre **billetterie +
Fodium Transport**, avec un système de pass combiné (billet + navette) et un
parcours de paiement repensé.

**Démo** : _(à compléter)_

---

## Installation

```bash
pnpm install
pnpm dev
```

Autres commandes :

```bash
pnpm build      # build de production
pnpm test       # tests unitaires (Vitest)
pnpm typecheck  # vérification TypeScript
pnpm lint       # ESLint
```

---

## Choix techniques

| Besoin | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 16 · App Router · React 19.3 | Des routes réelles, condition nécessaire aux View Transitions inter-pages |
| Style | Tailwind CSS v4 | Imposé par le brief |
| Composants | shadcn/ui (base Radix, preset Nova) | Code possédé donc modifiable en profondeur |
| Icônes | Lucide | Déjà utilisé par Fodium — cohérence avec l'existant |
| Thème | next-themes, sombre par défaut | _(voir « Identité » ci-dessous)_ |
| Tests | Vitest + Testing Library | Logique métier testée ; les animations ne le sont pas |

_(Les technologies d'animation et leur justification sont documentées au fur et
à mesure de leur introduction.)_

---

## Identité visuelle

La charte n'est pas inventée : elle est **relevée sur le site Fodium existant**
(https://fodium.kanzey.co) et sur le logo de la marque.

**Le logo comme source du système.** Le logo Fodium est un disque orange à
anneau perforé, contenant des hexagones imbriqués et un QR code. Il encode
donc déjà *billet + perforation + validation*. Le système visuel en est dérivé
plutôt qu'inventé :

- l'**anneau perforé** devient le bord déchirable du billet, puis la jauge du
  geste de paiement ;
- l'**hexagone** devient le marqueur de point de départ sur la carte navette ;
- le **QR** devient la validation, qui se dessine au moment du tamponnage.

**Couleurs.** L'orange de marque `#F07F00` est relevé sur le site réel et reste
identique dans les deux thèmes.

Un point d'accessibilité a été corrigé au passage : cet orange n'offre qu'un
contraste de **2,59:1** sur fond clair, sous le seuil AA (4,5:1) — y compris
pour du gros texte. Le site actuel l'utilise pourtant pour afficher les prix
sur fond blanc. Ici, l'orange reste couleur de surface et d'accent, et le texte
de marque bascule sur un ambre `#B45309` (4,80:1, AA) en thème clair. En thème
sombre, l'orange atteint 7,30:1 (AAA) et est utilisé tel quel.

De même, le libellé des boutons primaires est noir (`6,79:1`, AA) et non blanc
(`2,71:1`, échec).

**Typographie.** Le site actuel n'utilise aucune police custom.

- **Bricolage Grotesque** — titres ; axe variable animable
- **Geist Sans** — texte courant
- **Geist Mono** — prix, horaires, numéros de billet : chiffres tabulaires,
  idiome du billet

---

## Le pass combiné

_(à compléter)_

## Le parcours de paiement réinventé

_(à compléter — quel problème du paiement classique il résout, et pourquoi
c'est mieux)_

## Innovation technique

Le critère retenu pour chaque technologie : **qu'apporte-t-elle que le CSS
classique n'aurait pas permis ?** Une technologie qui n'y répond pas n'est pas
utilisée — le brief met en garde contre la complexité gratuite.

### Propriété personnalisée enregistrée (`@property`) — couleur d'ambiance

La page d'accueil change de couleur d'ambiance selon l'événement survolé ou
centré à l'écran. Un dégradé ne s'interpole pas en CSS : `transition` sur un
`radial-gradient` produit un saut brutal.

La solution est d'enregistrer `--ambient` via `@property` avec le type
`<color>`. Une propriété personnalisée typée devient **animable**, ce qu'une
variable CSS ordinaire n'est pas. La bascule est donc fluide, sans boucle
d'interpolation en JavaScript et sans re-rendu React — la valeur est écrite
directement sur `documentElement`.

### GSAP SplitText — entrée du titre

Le titre se révèle caractère par caractère. En CSS, il faudrait écrire un
`<span>` et un délai par caractère dans le JSX : le texte devient illisible
pour un lecteur d'écran, et changer le libellé oblige à refaire l'animation.

SplitText découpe au runtime et restaure le DOM d'origine au démontage. Son
option `autoSplit` redécoupe automatiquement quand la police définitive
remplace la police de repli — sans quoi l'animation se déclencherait sur des
positions de caractères qui bougent ensuite.

### GSAP ScrollTrigger — orchestration au scroll

Deux usages distincts sur la page d'accueil :

1. l'entrée en cascade des cartes, déclenchée à l'approche de la section ;
2. **la couleur d'ambiance qui suit la carte la plus proche du centre de
   l'écran** — indispensable sur mobile, où le survol n'existe pas.

Le CSS ne sait pas piloter une séquence en fonction de la position de défilement.
`IntersectionObserver` couvrirait le second cas, mais pas le premier, et
imposerait de recoder la logique de seuils que ScrollTrigger fournit.

### Ce qui reste volontairement en CSS

Le badge « bientôt » anime `stroke-dashoffset` en CSS pur. Une boucle
décorative n'a besoin ni de JavaScript ni de re-rendu, et l'animation reste
composée par le GPU. Y mettre GSAP serait exactement la complexité gratuite
que le brief reproche.

### Accessibilité des animations

Toutes les animations décoratives sont encadrées par
`gsap.matchMedia('(prefers-reduced-motion: no-preference)')` : sous cette
préférence, elles **n'existent pas** plutôt que d'être accélérées. Vérifié —
le titre et les six cartes restent à une opacité de 1 sans animation.

En revanche, la couleur d'ambiance reste active quelle que soit la préférence :
elle porte une information (quelle carte est active), elle n'est pas décorative.

---

## Priorisation

_(à compléter — ce qui a été priorisé et pourquoi)_

## Avec plus de temps

_(à compléter)_

---

## Données et visuels

Aucun backend : les données sont mockées en TypeScript dans `src/lib/data/`.
Elles sont ancrées dans la réalité dakaroise — lieux, moyens de paiement et
devise relevés sur le site Fodium existant, quartiers de départ et liaisons
interurbaines réels.

Les photos proviennent d'Unsplash (licence libre). Elles ne sont pas utilisées
telles quelles : `scripts/duotone.mjs` leur applique un duotone calé sur la
couleur d'ambiance de chaque événement. Le traitement est fait au build et non
en CSS, car un filtre CSS se recalcule à chaque repaint et saccade le scroll.

```bash
node scripts/fetch-photos.mjs   # télécharge les sources dans public/events/raw/
node scripts/duotone.mjs        # produit les visuels traités dans public/events/
```

---

## Accessibilité

- `prefers-reduced-motion` respecté : les animations décoratives s'annulent.
- Contrastes vérifiés AA dans les deux thèmes.
- Interface en français, `lang="fr"`.
