import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SoonBadge } from './soon-badge'

describe('SoonBadge', () => {
  it('annonce « bientôt » en texte lisible', () => {
    render(<SoonBadge />)
    expect(screen.getByText('bientôt')).toBeInTheDocument()
  })

  it('masque l\'anneau décoratif aux lecteurs d\'écran', () => {
    const { container } = render(<SoonBadge />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden')
  })

  it('reste lisible sans animation : le texte n\'est pas porté par du CSS seul', () => {
    // Si le libellé était dessiné (pseudo-élément, image), il disparaîtrait
    // des lecteurs d'écran et de la recherche.
    const { container } = render(<SoonBadge />)
    expect(container.textContent).toContain('bientôt')
  })
})
