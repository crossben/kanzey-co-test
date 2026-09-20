'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS, isActive } from './nav-items'
import { SoonBadge } from './soon-badge'

/**
 * Barre d'onglets flottante, mobile uniquement (brief §3.1).
 *
 * Flottante au sens propre : détachée des bords, posée au-dessus du contenu.
 * Elle disparaît à partir de `lg`, où le header horizontal prend le relais —
 * le brief interdit explicitement de conserver la barre sur desktop.
 */
export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <ul className="mx-3 flex items-stretch justify-between gap-1 rounded-2xl border border-border bg-surface/85 p-1.5 shadow-lg shadow-black/25 backdrop-blur-xl">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] transition-colors ${
                  active
                    ? 'bg-accent text-brand-text'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-5 shrink-0" aria-hidden />
                <span className="leading-none">{item.label}</span>

                {/* Le badge déborde au-dessus de la barre : dans un onglet de
                    ~70 px il écraserait le libellé, et le brief exige qu'il
                    reste visible. Déborder attire l'œil, ce que « bientôt »
                    cherche précisément. */}
                {item.soon && (
                  <SoonBadge className="absolute -top-3.5 left-1/2 -translate-x-1/2 border border-border bg-surface px-1.5 text-[9px]" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
