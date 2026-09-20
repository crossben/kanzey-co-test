/**
 * Formate un montant en francs CFA.
 * Séparateur : espace insécable fine (U+202F), conforme à l'usage français.
 */
export function formatXOF(amount: number): string {
  const grouped = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  })
    .format(amount)
    // Intl produit une espace insécable normale ou fine selon la version
    // d'ICU du runtime. On normalise pour que le rendu serveur et le rendu
    // client soient identiques.
    .replace(/[  \s]/g, ' ')

  return `${grouped} XOF`
}

/**
 * Formate la date d'un événement en français.
 *
 * `timeZone: 'UTC'` est indispensable : sans lui, le serveur et le navigateur
 * formatent dans des fuseaux différents et React signale une erreur
 * d'hydratation.
 */
export function formatEventDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
