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

Sur la page d'un événement, deux formules : **Billet seul** ou
**Billet + Navette**. Choisir la seconde fait apparaître le sélecteur de point
de départ ; le total se recalcule ; un récapitulatif précède la validation.

Trois décisions méritent d'être expliquées.

**Le billet n'est pas remplacé, il se déplie.** La même primitive `<Ticket>`
sert de carte sur l'accueil, de page sur l'événement, et d'objet payé dans le
tunnel. Ajouter la navette ne construit pas un autre composant : le billet
reçoit une souche supplémentaire, séparée par une perforation. L'objet reste
le même, ce qui rend le pass combiné littéralement visible.

**Le point de départ se choisit sur une carte, pas dans une liste
déroulante.** Choisir un quartier est une décision géographique ; une liste
oblige à reconstruire mentalement la carte. La carte est doublée d'une liste
de quartiers — la carte seule serait inutilisable au clavier et peu praticable
au doigt.

**Le prix roule jusqu'à sa nouvelle valeur.** Un chiffre qu'on remplace ne se
voit pas changer : l'œil constate qu'il est différent, sans percevoir le lien
avec l'action. L'interpolation rend la cause visible. Le montant animé est
masqué aux lecteurs d'écran, et la valeur finale est annoncée séparément —
sinon chaque valeur intermédiaire serait lue.

Le billet est collant sur desktop : il reste visible pendant qu'on compose son
pass, pour qu'on voie ce qu'on achète.

## Le parcours de paiement réinventé

### Le problème

Le parcours classique d'une billetterie sénégalaise enchaîne : formulaire,
choix de l'opérateur, redirection vers l'application (Wave, Orange Money),
retour vers le site, écran de confirmation.

Cela produit trois défauts, dans l'ordre de gravité :

1. **Le doute.** Entre la redirection et le retour, l'utilisateur ne sait plus
   si la transaction a abouti. C'est le moment où l'on rafraîchit la page, où
   l'on repaie par erreur, où l'on appelle le support.
2. **La perte de vue de l'achat.** Dès la deuxième étape, ce qu'on achète
   disparaît de l'écran. On paie un montant, plus un billet.
3. **La confirmation qui ne prouve rien.** Un « ✓ Paiement réussi » est un
   message, pas un objet. Il ne rassure que le temps de l'afficher.

### La proposition — « Le Geste »

**Un seul écran, une seule interaction continue.**

Le billet, le moyen de paiement et la validation coexistent sur la même
surface. Le billet arrive de la page précédente par morph et **reste visible
du début à la fin** : on voit ce qu'on achète pendant qu'on paie.

**Le moyen de paiement est un objet, pas une option.** Quatre jetons portant
les couleurs des opérateurs — on reconnaît Wave ou Orange Money avant d'avoir
lu le libellé. Une liste déroulante rend cette reconnaissance impossible.

**La validation se fait en maintenant le doigt.** L'anneau perforé du logo
Fodium se remplit segment par segment autour du point de contact.

C'est le point central : **la durée du maintien EST la confirmation**. Un
appui accidentel ne valide rien — relâcher avant la fin annule et l'anneau se
vide. L'écran « êtes-vous sûr ? » devient donc inutile, et une étape disparaît
du parcours sans rien perdre en sécurité. L'anneau dit en continu où l'on en
est, ce qu'un bouton pressé ne dit jamais.

**La confirmation n'est pas un message : c'est le billet qui devient valide.**
Une troisième souche se détache, portant le QR et la référence — après la
souche navette, dans la même logique de dépliage. Une preuve tangible qu'on
peut montrer à l'entrée, pas une phrase qui disparaît au rechargement.

Le QR est un **vrai QR code scannable**, pas un motif décoratif : vérifié par
décodage du SVG effectivement rendu dans le navigateur.

### Accessibilité du geste

Un geste ne doit jamais être la seule voie d'accès au paiement.

- Au clavier, **Entrée ou Espace valide directement** : maintenir une touche
  n'est pas un geste fiable selon les technologies d'assistance.
- Un bouton **« Valider sans maintenir »** est visible en permanence.
- Sous `prefers-reduced-motion`, le maintien est désactivé : le bouton devient
  un bouton ordinaire et son libellé change en conséquence — annoncer
  « Maintenir » quand le maintien ne fonctionne plus serait un mensonge
  d'interface.

### Ce qui n'est pas fait

Aucun paiement réel : le brief l'exclut explicitement (§6). La commande
voyage dans l'URL, sans backend. Dans un vrai système, la référence du billet
serait un identifiant signé côté serveur et non une valeur déterministe.

## Innovation technique

Le critère retenu pour chaque technologie : **qu'apporte-t-elle que le CSS
classique n'aurait pas permis ?** Une technologie qui n'y répond pas n'est pas
utilisée — le brief met en garde contre la complexité gratuite.

### View Transitions API — le billet qui traverse les écrans

C'est l'axe principal. Quand on ouvre un événement depuis l'accueil, la carte
ne disparaît pas pour laisser place à une page : **le billet se déplie**. Le
navigateur anime le même élément de sa position dans la grille vers sa
position sur la page.

Le CSS ne sait pas faire cela : une animation CSS vit dans un seul document et
ne peut pas relier un élément qui disparaît à un élément qui apparaît sur une
autre route. C'est précisément ce que l'API View Transitions ajoute.

Concrètement : `<ViewTransition name={...} share="morph" default="none">` de
part et d'autre de la navigation. Les deux props vont ensemble — sans
`default="none"`, l'élément nommé s'animerait à **chaque** transition de la
page, pas seulement lors de son propre morph.

Deux conditions ont guidé l'implémentation :

- Le morph n'a lieu que si la destination se rend dans le même commit que la
  navigation. Les six pages d'événement sont donc **générées à la
  compilation** : une page rendue à la demande afficherait d'abord un état de
  chargement et casserait la continuité.
- Sans support navigateur, la navigation fonctionne normalement, sans
  animation.

**Vérifié, pas supposé** : pendant la navigation, le navigateur anime bien
`::view-transition-group(ticket-1)`, `::view-transition-image-pair(ticket-1)`,
`-old` et `-new`, sur 420 ms, avec le flou de mi-parcours défini dans
`globals.css` — ce flou masque les artefacts d'interpolation pendant le
redimensionnement.

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

### Le portefeuille, et pourquoi pas de WebGL

Le billet acheté atterrit dans **Mes billets** et y reste : il est conservé
dans le navigateur (`localStorage`), survit au rechargement, et reste
consultable hors connexion. Sans cela, le portefeuille ne serait qu'un décor
et le parcours s'arrêterait au paiement.

La lecture passe par `useSyncExternalStore` plutôt qu'un `useState` dans un
effet : le portefeuille vit dans le navigateur, pas dans React, et c'est l'API
prévue pour s'abonner à une source externe. Deux sources sont écoutées —
l'événement `storage` pour les autres onglets, un événement interne pour
l'onglet courant, que `storage` ignore par conception.

Tous les accès au stockage sont protégés : navigation privée, stockage bloqué
ou quota dépassé font apparaître un portefeuille vide, jamais une page en
erreur. Un contenu corrompu ou écrit par un schéma antérieur est filtré.

**Le billet est holographique** — une feuille irisée qui réagit à
l'inclinaison de l'appareil, ou au pointeur sur desktop.

La conception prévoyait du WebGL (React Three Fiber) pour cet effet. Il a été
écarté : Three.js pèse environ 600 ko pour un reflet que des dégradés en
`color-dodge` rendent de façon quasi identique, pour quelques centaines
d'octets. Le brief demande que l'innovation serve l'expérience et prévient
contre la complexité gratuite : ici le poids ne s'achetait aucun gain perçu.

L'effet est volontairement discret. Une première version plus spectaculaire
rendait le titre et le prix illisibles — un billet qu'on ne peut plus lire
n'est plus un billet.

### Motion — dépliage du billet et prix qui roule

Le sélecteur de navette apparaît et disparaît selon la formule choisie.
`AnimatePresence` anime aussi la **sortie** : sans lui, le bloc disparaîtrait
d'un coup en revenant au billet seul, ce qu'une transition CSS ne peut pas
couvrir puisque l'élément est démonté.

Le ressort utilisé est interruptible : basculer deux fois rapidement entre les
formules ne produit pas de saccade, l'animation repart de sa position
courante. Une transition CSS, elle, n'est ni physique ni interruptible.

### Les graphiques (evilcharts) et leur coût

Deux graphiques seulement, chacun justifié par une décision d'achat :

- **la jauge de remplissage** répond à « dois-je me dépêcher ? » ;
- **la courbe d'affluence par créneau** répond à « quel départ sera chargé ? ».

Un graphique qui n'informe aucune décision est décoratif, et se voit comme
tel. Recharts pèse environ 100 ko : il n'est chargé que sur la page
événement, jamais sur l'accueil.

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
