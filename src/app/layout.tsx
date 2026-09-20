import type { Metadata } from 'next'
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { DesktopHeader } from '@/components/nav/desktop-header'
import { MobileTabBar } from '@/components/nav/mobile-tab-bar'
import './globals.css'
import { cn } from "@/lib/utils";

// Titres : forte personnalité en très grand, axe variable animable au scroll.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

// Texte courant : neutre, lisible en petit.
const geist = Geist({subsets:['latin'],variable:'--font-sans'})

// Prix, horaires, numéros de billet : chiffres tabulaires, idiome du billet.
const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fodium — Billetterie & Transport',
  description:
    "Achetez votre billet et votre navette en une seule fois. Événements à Dakar et trajets interurbains.",
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", display.variable, mono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <DesktopHeader />
          {children}
          <MobileTabBar />
        </ThemeProvider>
      </body>
    </html>
  )
}
