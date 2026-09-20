import type { Metadata } from 'next'
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { DesktopHeader } from '@/components/nav/desktop-header'
import { MobileTabBar } from '@/components/nav/mobile-tab-bar'
import { AmbientBackdrop } from '@/components/home/ambient'
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

/**
 * Origine publique du site.
 *
 * Alimente `metadataBase`, donc l'URL absolue de l'image de partage. Sans
 * elle, Next.js préfixe par `localhost:3000` et aucun réseau social ne peut
 * récupérer l'image une fois le site déployé.
 *
 * Lue au BUILD, pas au démarrage : les pages sont précalculées, donc la
 * valeur est figée dans le HTML généré. Elle doit être présente au moment
 * du `next build` (c'est le rôle de `.env.production`).
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Fodium — Billetterie & Transport',
    template: '%s',
  },
  description:
    "Achetez votre billet et votre navette en une seule fois. Événements à Dakar et trajets interurbains.",
  openGraph: {
    type: 'website',
    locale: 'fr_SN',
    siteName: 'Fodium',
    title: 'Fodium — Un billet. Une navette. Un seul geste.',
    description:
      'Billetterie et transport au Sénégal — réservés ensemble, payés en une fois.',
  },
  twitter: { card: 'summary_large_image' },
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
          <AmbientBackdrop />
          <DesktopHeader />
          {children}
          <MobileTabBar />
        </ThemeProvider>
      </body>
    </html>
  )
}
