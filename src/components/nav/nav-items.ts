import { Home, Ticket, Bus, Wallet, User, type LucideIcon } from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  /** Service annoncé mais pas encore ouvert : porte le badge « bientôt ». */
  soon?: boolean
}

/**
 * Les 5 accès du brief §3.1.
 *
 * Source unique, partagée par la barre mobile et le header desktop : deux
 * listes séparées finiraient par diverger.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/evenements', label: 'Événements', icon: Ticket },
  { href: '/transport', label: 'Transport', icon: Bus, soon: true },
  { href: '/mes-billets', label: 'Mes billets', icon: Wallet },
  { href: '/profil', label: 'Profil', icon: User },
]

/**
 * Un onglet est actif sur sa route et ses sous-routes, sauf l'accueil qui
 * ne l'est que sur `/` exactement — sans quoi il resterait allumé partout.
 */
export function isActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}
