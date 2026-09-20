# Cahier des charges — Challenge frontend Fodium

## 1. Contexte

Fodium est une billetterie digitale sécurisée (Kanzey.co) qui lance un nouveau service, **Fodium Transport** (navettes événementielles et trajets interurbains). L'objectif du challenge est de reconcevoir la page d'accueil pour refléter cette double offre, avec une expérience mobile-first vivante et un système de vente combiné inédit sur le marché.

On ne cherche pas une page "propre et correcte" de plus : on veut un résultat **résolument révolutionnaire** — une interface qui sort du lot des sites de billetterie classiques, qui surprend et qui donne envie de scroller. C'est le fil rouge de toute l'évaluation, au-delà de la simple conformité au brief.

## 2. Objectif du challenge

Développer une page d'accueil fonctionnelle (prototype frontend, sans backend réel requis — données mockées acceptées) qui démontre :
- la structure d'information et la navigation,
- le concept de pass combiné,
- une interface animée et réactive.

## 3. Périmètre fonctionnel attendu

### 3.1 Navigation

- Navigation flottante en bas de l'écran sur mobile (pattern type barre d'onglets), avec 5 accès :
  1. Accueil
  2. Événements
  3. Transport *(affiché avec un badge "bientôt", non cliquable ou menant à une page teaser)*
  4. Mes billets
  5. Profil
- Sur desktop/tablette large, adapter la navigation en header horizontal (même 5 accès, pas de barre flottante).

### 3.2 Page d'accueil

- Barre de recherche unifiée (événements et trajets).
- Deux raccourcis visuels distincts : Événements / Transport.
- Une liste d'événements à venir (minimum 3 cartes), avec image/icône, nom, date, lieu, prix.
- Le reste de la composition de la page (blocs additionnels, mise en avant, contenu complémentaire) est laissé au **libre arbitre du·de la candidat·e** — on évalue la capacité à structurer une page pertinente, pas la capacité à suivre une liste.

### 3.3 Pass combiné (billet + transport)

Sur la page d'un événement (à créer également) :
- Deux options d'achat clairement différenciées : **Billet seul** vs **Billet + Navette**.
- Si "Billet + Navette" est sélectionné : un sélecteur de point de départ de navette doit apparaître.
- Le prix total doit se recalculer dynamiquement selon le choix.
- Un récapitulatif clair avant validation (même sans paiement réel fonctionnel).

### 3.4 Réinventer le parcours de paiement

Le parcours de paiement actuel (formulaire classique, choix de l'opérateur, redirection) est fonctionnel mais banal — on veut que le·la candidat·e **ose proposer autre chose**. Ce n'est pas une contrainte technique de plus : c'est un vrai terrain d'expérimentation UX.

Quelques pistes possibles (non limitatives, à ne surtout pas traiter comme une liste à cocher) :
- Un flux en une seule interaction continue plutôt qu'une succession d'écrans/étapes classiques,
- Une sélection du moyen de paiement (Wave, Orange Money, carte...) pensée comme une expérience visuelle forte plutôt qu'un simple menu déroulant,
- Un retour visuel de confirmation qui sorte du "✓ Paiement réussi" générique,
- Toute autre idée qui rend l'acte de payer plus rapide, plus rassurant, ou plus agréable que ce qui se fait aujourd'hui sur les billetteries sénégalaises.

Le paiement réel n'est pas fonctionnel (voir section 6) — c'est bien la **conception de l'expérience** qui est évaluée ici, pas l'intégration d'une vraie passerelle. Le choix doit être expliqué dans le README : quel problème du paiement classique ça résout, et pourquoi c'est mieux.

### 3.5 Micro-interactions et animation attendues

L'interface doit se sentir **vivante**, pas statique : mouvement, retour visuel, transitions. La manière d'y arriver est volontairement laissée libre — aucune liste imposée. C'est un des critères où on attend le plus d'initiative.

Seule contrainte fixe : le badge "bientôt" sur Transport doit être visuellement vivant (pas un simple texte figé).

### 3.6 Exigence d'innovation technique

Le brief classique s'arrête là où l'innovation commence. On attend que le·la candidat·e sorte du standard React/CSS classique et **explore une technologie récente ou peu répandue** pour au moins une partie de l'interface — au choix, par exemple (liste non limitative) :
- WebGL / Three.js / Canvas pour un effet visuel distinctif,
- View Transitions API pour des transitions de page natives,
- Web Animations API avancée plutôt que de simples transitions CSS,
- une librairie d'animation moderne peu commune (GSAP, Framer Motion, Motion One, Lottie...),
- toute autre techno du candidat justifiant un vrai gain (performance, fluidité, effet impossible autrement).

Le choix doit être **justifié dans le README** : pourquoi cette techno, ce qu'elle apporte que du CSS classique n'aurait pas permis. On ne cherche pas la complexité pour la complexité — l'innovation doit servir l'expérience, pas juste impressionner.

## 4. Contraintes techniques

- **Responsive obligatoire** : mobile (prioritaire) et desktop.
- **Mode sombre non obligatoire mais apprécié.**
- **Tailwind CSS obligatoire** pour le style de l'interface (utilisation cohérente des utilitaires, pas de gros blocs de CSS custom en parallèle sauf cas justifié, ex. animations avancées).
- Stack libre pour le reste (React, Vue, Svelte, HTML/JS vanilla...), à justifier brièvement dans le README — seul Tailwind CSS est imposé comme techno de style.
- Pas de dépendance à un backend réel — données mockées en dur ou via fichier JSON local acceptées.
- Code versionné sur un dépôt Git (GitHub de préférence), historique de commits visible (pas un commit unique "final version").

## 5. Livrables attendus

1. Lien vers une démo déployée et accessible (Vercel, Netlify, GitHub Pages, ou équivalent).
2. Dépôt de code source public ou partagé en lecture.
3. Un court README expliquant :
   - les choix techniques faits,
   - ce qui a été priorisé et pourquoi,
   - ce qui aurait été fait avec plus de temps.

## 6. Ce qui n'est pas demandé

- Pas besoin d'authentification fonctionnelle.
- Pas besoin de paiement réel intégré.
- Pas besoin de couvrir les autres interfaces (agent scan, vendeur, admin, organisateur) — le challenge se concentre uniquement sur l'expérience spectateur, page d'accueil et achat.

## 7. Critères d'évaluation

| Critère | Poids |
|---|---|
| Qualité et lisibilité du code | 15 % |
| Fidélité au concept (pass combiné, nav, structure) | 15 % |
| Qualité UX/UI et animation | 20 % |
| Réinvention du parcours de paiement | 15 % |
| Responsive réel (mobile + desktop) | 10 % |
| Innovation technique justifiée | 15 % |
| Initiative et créativité au-delà du brief | 10 % |

## 8. Délai

5 jours calendaires à partir de la réception de ce document. En cas de contrainte particulière, le·la candidat·e peut signaler un délai raisonnable supplémentaire par écrit avant la date limite.

## 9. Contact

Pour toute question durant le challenge : **fodium@kanzey.co**
