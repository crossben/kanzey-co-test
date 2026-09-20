'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * Bascule clair/sombre.
 *
 * Aucun état de montage : les deux icônes sont rendues et c'est le CSS qui
 * révèle la bonne, à partir de la classe `.dark` que next-themes pose sur
 * `<html>` avant le premier rendu.
 *
 * Ce choix évite deux problèmes du motif `useState(mounted)` : la discordance
 * d'hydratation sur l'icône et le libellé, et le rendu en cascade que le
 * compilateur React signale quand on appelle `setState` dans un effet.
 *
 * Le libellé reste constant pour la même raison : il ne peut pas dépendre
 * d'un thème inconnu côté serveur.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Changer de thème"
    >
      <Moon className="size-4 dark:hidden" aria-hidden />
      <Sun className="hidden size-4 dark:block" aria-hidden />
    </Button>
  )
}
