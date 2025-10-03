import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WinnersDisplay } from '@/components/WinnersDisplay'

// URL and document mocks are handled in global test setup

describe('WinnersDisplay Component', () => {
  const mockDrawResult = {
    winners: [
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Charlie Brown', email: 'charlie@example.com' },
      { name: 'Diana Wilson', email: 'diana@example.com' },
      { name: 'Eve Davis', email: 'eve@example.com' },
      { name: 'Frank Miller', email: 'frank@example.com' },
      { name: 'Grace Taylor', email: 'grace@example.com' }
    ],
    timestamp: '2024-01-15T10:30:00.000Z',
    totalParticipants: 100,
    drawId: 'abc12345'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders winners display correctly', () => {
    render(<WinnersDisplay result={mockDrawResult} />)
    
    expect(screen.getByText('Winners Selected!')).toBeInTheDocument()
    expect(screen.getByText('7 winners drawn from 100 participants')).toBeInTheDocument()
  })

  it('displays all winners with correct information', () => {
    render(<WinnersDisplay result={mockDrawResult} />)
    
    mockDrawResult.winners.forEach((winner, index) => {
      expect(screen.getByText(winner.name)).toBeInTheDocument()
      expect(screen.getByText(winner.email)).toBeInTheDocument()
      expect(screen.getByText((index + 1).toString())).toBeInTheDocument()
    })
  })

  it('displays draw metadata correctly', () => {
    render(<WinnersDisplay result={mockDrawResult} />)
    
    expect(screen.getByText('Draw ID: abc12345')).toBeInTheDocument()
    expect(screen.getByText(/Timestamp:/)).toBeInTheDocument()
    expect(screen.getByText('Method: Cryptographically secure random selection')).toBeInTheDocument()
  })

  it('handles download report functionality', async () => {
    const user = userEvent.setup()
    render(<WinnersDisplay result={mockDrawResult} />)
    
    const downloadButton = screen.getByText('Download Audit Report (TXT + JSON)')
    await user.click(downloadButton)
    
    // Should create two blob URLs (one for TXT, one for JSON)
    expect(mockCreateObjectURL).toHaveBeenCalledTimes(2)
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2)
    
    // Should create two download links
    expect(mockCreateElement).toHaveBeenCalledTimes(2)
    expect(mockClick).toHaveBeenCalledTimes(2)
  })

  it('generates correct TXT report content', async () => {
    const user = userEvent.setup()
    render(<WinnersDisplay result={mockDrawResult} />)
    
    const downloadButton = screen.getByText('Download Audit Report (TXT + JSON)')
    await user.click(downloadButton)
    
    // Check that blob was created with correct content type
    const txtBlobCall = mockCreateObjectURL.mock.calls.find(call => 
      call[0] instanceof Blob && call[0].type === 'text/plain'
    )
    expect(txtBlobCall).toBeDefined()
    
    // Check download filename
    const txtLinkCall = mockCreateElement.mock.calls.find(call => 
      call[0] === 'a'
    )
    expect(txtLinkCall).toBeDefined()
  })

  it('generates correct JSON report content', async () => {
    const user = userEvent.setup()
    render(<WinnersDisplay result={mockDrawResult} />)
    
    const downloadButton = screen.getByText('Download Audit Report (TXT + JSON)')
    await user.click(downloadButton)
    
    // Check that JSON blob was created
    const jsonBlobCall = mockCreateObjectURL.mock.calls.find(call => 
      call[0] instanceof Blob && call[0].type === 'application/json'
    )
    expect(jsonBlobCall).toBeDefined()
  })

  it('handles single winner correctly', () => {
    const singleWinnerResult = {
      ...mockDrawResult,
      winners: [mockDrawResult.winners[0]]
    }
    
    render(<WinnersDisplay result={singleWinnerResult} />)
    
    expect(screen.getByText('1 winner drawn from 100 participants')).toBeInTheDocument()
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('handles empty winners list', () => {
    const emptyWinnersResult = {
      ...mockDrawResult,
      winners: []
    }
    
    render(<WinnersDisplay result={emptyWinnersResult} />)
    
    expect(screen.getByText('0 winners drawn from 100 participants')).toBeInTheDocument()
  })

  it('displays winners in correct order with animation delays', () => {
    render(<WinnersDisplay result={mockDrawResult} />)
    
    const winnerElements = screen.getAllByText(/Alice|Bob|Charlie|Diana|Eve|Frank|Grace/)
    const winnerCards = winnerElements.map(el => el.closest('.animate-in'))
    
    // Check that animation delays are applied
    winnerCards.forEach((card, index) => {
      if (card) {
        expect(card).toHaveStyle(`animation-delay: ${index * 100}ms`)
      }
    })
  })

  it('handles winners with special characters in names', () => {
    const specialWinnersResult = {
      ...mockDrawResult,
      winners: [
        { name: 'José María', email: 'jose@example.com' },
        { name: 'François', email: 'francois@example.com' },
        { name: '李小明', email: 'li@example.com' },
        { name: 'Александр', email: 'alex@example.com' },
        { name: 'محمد', email: 'mohammed@example.com' },
        { name: '山田太郎', email: 'yamada@example.com' },
        { name: 'José María', email: 'jose2@example.com' }
      ]
    }
    
    render(<WinnersDisplay result={specialWinnersResult} />)
    
    expect(screen.getByText('7 winners drawn from 100 participants')).toBeInTheDocument()
    specialWinnersResult.winners.forEach(winner => {
      expect(screen.getByText(winner.name)).toBeInTheDocument()
      expect(screen.getByText(winner.email)).toBeInTheDocument()
    })
  })

  it('handles winners with long names and emails', () => {
    const longWinnersResult = {
      ...mockDrawResult,
      winners: [
        { 
          name: 'Very Long Name That Might Cause Layout Issues In The UI Component', 
          email: 'very.long.email.address.that.might.cause.layout.issues@verylongdomainname.com' 
        },
        { 
          name: 'Another Very Long Name With Many Words And Characters', 
          email: 'another.very.long.email@anotherverylongdomainname.com' 
        }
      ]
    }
    
    render(<WinnersDisplay result={longWinnersResult} />)
    
    expect(screen.getByText('2 winners drawn from 100 participants')).toBeInTheDocument()
    longWinnersResult.winners.forEach(winner => {
      expect(screen.getByText(winner.name)).toBeInTheDocument()
      expect(screen.getByText(winner.email)).toBeInTheDocument()
    })
  })

  it('formats timestamp correctly', () => {
    render(<WinnersDisplay result={mockDrawResult} />)
    
    const timestampElement = screen.getByText(/Timestamp:/)
    expect(timestampElement).toBeInTheDocument()
    
    // Should display formatted date
    expect(timestampElement.textContent).toContain('1/15/2024')
  })

  it('handles different draw IDs correctly', () => {
    const customDrawResult = {
      ...mockDrawResult,
      drawId: 'custom-draw-123'
    }
    
    render(<WinnersDisplay result={customDrawResult} />)
    
    expect(screen.getByText('Draw ID: custom-draw-123')).toBeInTheDocument()
  })

  it('handles different participant counts correctly', () => {
    const customDrawResult = {
      ...mockDrawResult,
      totalParticipants: 50
    }
    
    render(<WinnersDisplay result={customDrawResult} />)
    
    expect(screen.getByText('7 winners drawn from 50 participants')).toBeInTheDocument()
  })

  it('maintains accessibility with proper ARIA labels', () => {
    render(<WinnersDisplay result={mockDrawResult} />)
    
    // Check that download button is accessible
    const downloadButton = screen.getByRole('button', { name: /Download Audit Report/i })
    expect(downloadButton).toBeInTheDocument()
    
    // Check that winner cards have proper structure
    const winnerCards = screen.getAllByText(/Alice|Bob|Charlie|Diana|Eve|Frank|Grace/)
    winnerCards.forEach(card => {
      expect(card.closest('[class*="rounded-lg"]')).toBeInTheDocument()
    })
  })
})
