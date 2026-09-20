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

_(à compléter — pourquoi cette technologie, et ce qu'elle apporte que le CSS
classique n'aurait pas permis)_

---

## Priorisation

_(à compléter — ce qui a été priorisé et pourquoi)_

## Avec plus de temps

_(à compléter)_

---

## Accessibilité

- `prefers-reduced-motion` respecté : les animations décoratives s'annulent.
- Contrastes vérifiés AA dans les deux thèmes.
- Interface en français, `lang="fr"`.
