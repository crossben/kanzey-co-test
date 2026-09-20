import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Ticket } from './ticket'
import { events } from '@/lib/data/events'

const event = events[0] // JOJ Dakar 2026, 15 000 XOF, Dakar Arena

describe('Ticket', () => {
  it("affiche le titre de l'événement", () => {
    render(<Ticket event={event} />)
    expect(screen.getByText(event.title)).toBeInTheDocument()
  })

  it('affiche le prix formaté en XOF', () => {
    render(<Ticket event={event} />)
    expect(screen.getByText(/15\s000 XOF/)).toBeInTheDocument()
  })

  it('affiche le lieu et la ville', () => {
    render(<Ticket event={event} />)
    expect(screen.getByText(/Dakar Arena/)).toBeInTheDocument()
    expect(screen.getByText(/Diamniadio/)).toBeInTheDocument()
  })

  it("n'affiche aucune souche transport par défaut", () => {
    render(<Ticket event={event} />)
    expect(screen.queryByTestId('shuttle-stub')).not.toBeInTheDocument()
  })

  it('affiche la souche transport quand une navette est fournie', () => {
    render(<Ticket event={event} shuttle={{ district: 'Plateau', time: '17:00' }} />)
    const stub = screen.getByTestId('shuttle-stub')
    expect(stub).toBeInTheDocument()
    expect(stub).toHaveTextContent('Plateau')
    expect(stub).toHaveTextContent('17:00')
  })

  it('affiche le total fourni plutôt que le prix du billet', () => {
    // Quand la navette est ajoutée, c'est le total recalculé qui prime.
    render(<Ticket event={event} shuttle={{ district: 'Plateau', time: '17:00' }} total={17000} />)
    expect(screen.getByText(/17\s000 XOF/)).toBeInTheDocument()
    expect(screen.queryByText(/15\s000 XOF/)).not.toBeInTheDocument()
  })

  it('expose la couleur d\'ambiance de l\'événement en variable CSS', () => {
    const { container } = render(<Ticket event={event} />)
    const article = container.querySelector('article')
    expect(article?.getAttribute('style')).toContain(event.accent)
  })

  it('porte un rôle article accessible nommé par son titre', () => {
    render(<Ticket event={event} />)
    expect(screen.getByRole('article', { name: event.title })).toBeInTheDocument()
  })
})
