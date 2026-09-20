'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS, isActive } from './nav-items'
import { SoonBadge } from './soon-badge'
import { ThemeToggle } from '@/components/theme-toggle'

/**
 * Header horizontal, desktop et tablette large (brief §3.1).
 * Mêmes 5 accès que la barre mobile, même source `NAV_ITEMS`.
 */
export function DesktopHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 hidden border-b border-border bg-background/80 backdrop-blur-xl lg:block">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-8 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image src="/icon.png" alt="" width={28} height={28} className="rounded-md" />
          <span className="font-display text-lg leading-none">Fodium</span>
        </Link>

        <nav aria-label="Navigation principale" className="flex-1">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-accent text-brand-text'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {item.soon && <SoonBadge />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
