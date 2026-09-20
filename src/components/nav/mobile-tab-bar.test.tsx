import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MobileTabBar } from './mobile-tab-bar'

const mockPathname = vi.fn(() => '/')
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('MobileTabBar', () => {
  it('rend les 5 accès du brief', () => {
    render(<MobileTabBar />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
  })

  it('porte un libellé de navigation accessible', () => {
    render(<MobileTabBar />)
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeInTheDocument()
  })

  it('marque l\'onglet courant avec aria-current', () => {
    mockPathname.mockReturnValue('/evenements')
    render(<MobileTabBar />)
    const actif = screen.getByRole('link', { current: 'page' })
    expect(actif).toHaveAttribute('href', '/evenements')
  })

  it('n\'active pas l\'accueil quand on est ailleurs', () => {
    mockPathname.mockReturnValue('/profil')
    render(<MobileTabBar />)
    const accueil = screen.getByRole('link', { name: /Accueil/ })
    expect(accueil).not.toHaveAttribute('aria-current')
  })

  it('affiche le badge « bientôt » sur Transport uniquement', () => {
    mockPathname.mockReturnValue('/')
    render(<MobileTabBar />)
    const badges = screen.getAllByText('bientôt')
    expect(badges).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Transport/ })).toHaveTextContent('bientôt')
  })

  it('offre des cibles tactiles d\'au moins 44 px', () => {
    // min-h-11 = 44px : seuil d'accessibilité tactile.
    render(<MobileTabBar />)
    for (const link of screen.getAllByRole('link')) {
      expect(link.className).toContain('min-h-11')
    }
  })
})
