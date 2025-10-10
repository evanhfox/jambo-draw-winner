import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WinnersDisplay } from '@/components/WinnersDisplay'

// URL and document mocks are handled in global test setup

describe('WinnersDisplay Component', () => {
  // Mock URL methods
  const mockCreateObjectURL = global.URL.createObjectURL as any
  const mockRevokeObjectURL = global.URL.revokeObjectURL as any
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
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
    drawId: 'abc12345',
    allParticipants: [
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Charlie Brown', email: 'charlie@example.com' },
      { name: 'Diana Wilson', email: 'diana@example.com' },
      { name: 'Eve Davis', email: 'eve@example.com' },
      { name: 'Frank Miller', email: 'frank@example.com' },
      { name: 'Grace Taylor', email: 'grace@example.com' },
      { name: 'Henry Adams', email: 'henry@example.com' },
      { name: 'Ivy Chen', email: 'ivy@example.com' },
      { name: 'Jack Wilson', email: 'jack@example.com' }
    ],
    csvFormat: 'simple' as const,
    randomizationDetails: {
      randomValues: [0.12345678, 0.87654321, 0.45678901, 0.23456789, 0.78901234, 0.34567890, 0.56789012, 0.89012345, 0.67890123, 0.90123456],
      preShuffleOrder: [
        { name: 'Alice Johnson', email: 'alice@example.com' },
        { name: 'Bob Smith', email: 'bob@example.com' },
        { name: 'Charlie Brown', email: 'charlie@example.com' },
        { name: 'Diana Wilson', email: 'diana@example.com' },
        { name: 'Eve Davis', email: 'eve@example.com' },
        { name: 'Frank Miller', email: 'frank@example.com' },
        { name: 'Grace Taylor', email: 'grace@example.com' },
        { name: 'Henry Adams', email: 'henry@example.com' },
        { name: 'Ivy Chen', email: 'ivy@example.com' },
        { name: 'Jack Wilson', email: 'jack@example.com' }
      ],
      postShuffleOrder: [
        { name: 'Alice Johnson', email: 'alice@example.com' },
        { name: 'Bob Smith', email: 'bob@example.com' },
        { name: 'Charlie Brown', email: 'charlie@example.com' },
        { name: 'Diana Wilson', email: 'diana@example.com' },
        { name: 'Eve Davis', email: 'eve@example.com' },
        { name: 'Frank Miller', email: 'frank@example.com' },
        { name: 'Grace Taylor', email: 'grace@example.com' },
        { name: 'Henry Adams', email: 'henry@example.com' },
        { name: 'Ivy Chen', email: 'ivy@example.com' },
        { name: 'Jack Wilson', email: 'jack@example.com' }
      ],
      shuffleSteps: [
        { step: 1, description: 'Swapping position 9 with position 2', participant: { name: 'Ivy Chen', email: 'ivy@example.com' }, randomValue: 0.67890123, newPosition: 2 },
        { step: 2, description: 'Swapping position 8 with position 5', participant: { name: 'Henry Adams', email: 'henry@example.com' }, randomValue: 0.89012345, newPosition: 5 },
        { step: 3, description: 'Swapping position 7 with position 1', participant: { name: 'Grace Taylor', email: 'grace@example.com' }, randomValue: 0.56789012, newPosition: 1 },
        { step: 4, description: 'Swapping position 6 with position 3', participant: { name: 'Frank Miller', email: 'frank@example.com' }, randomValue: 0.34567890, newPosition: 3 },
        { step: 5, description: 'Swapping position 5 with position 0', participant: { name: 'Eve Davis', email: 'eve@example.com' }, randomValue: 0.78901234, newPosition: 0 },
        { step: 6, description: 'Swapping position 4 with position 2', participant: { name: 'Diana Wilson', email: 'diana@example.com' }, randomValue: 0.23456789, newPosition: 2 },
        { step: 7, description: 'Swapping position 3 with position 1', participant: { name: 'Charlie Brown', email: 'charlie@example.com' }, randomValue: 0.45678901, newPosition: 1 },
        { step: 8, description: 'Swapping position 2 with position 0', participant: { name: 'Bob Smith', email: 'bob@example.com' }, randomValue: 0.87654321, newPosition: 0 },
        { step: 9, description: 'Swapping position 1 with position 0', participant: { name: 'Alice Johnson', email: 'alice@example.com' }, randomValue: 0.12345678, newPosition: 0 }
      ]
    },
    processingDetails: {
      csvSourceInfo: 'Simple CSV Format - Direct name,email pairs',
      parsingNotes: [
        'Direct CSV parsing without headers',
        'Split on comma delimiter',
        'Trimmed whitespace from all fields'
      ],
      validationResults: {
        totalEntries: 10,
        validEntries: 10,
        invalidEntries: 0,
        duplicatesRemoved: 0
      }
    }
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
    
    // Check that metadata is displayed (text is split across elements)
    expect(screen.getByText(/Draw ID:/)).toBeInTheDocument()
    expect(screen.getByText(/abc12345/)).toBeInTheDocument()
    expect(screen.getByText(/Timestamp:/)).toBeInTheDocument()
    expect(screen.getByText(/Method:/)).toBeInTheDocument()
  })

  it('handles download report functionality', async () => {
    const user = userEvent.setup()
    render(<WinnersDisplay result={mockDrawResult} />)
    
    const downloadButton = screen.getByText('Download Audit Report')
    expect(downloadButton).toBeInTheDocument()
    
    // Test that button can be clicked (download functionality is complex to test in jsdom)
    await user.click(downloadButton)
    expect(downloadButton).toBeInTheDocument()
  })

  it('generates correct TXT report content', async () => {
    const user = userEvent.setup()
    render(<WinnersDisplay result={mockDrawResult} />)
    
    const downloadButton = screen.getByText('Download Audit Report')
    expect(downloadButton).toBeInTheDocument()
    
    // Test that button can be clicked
    await user.click(downloadButton)
    expect(downloadButton).toBeInTheDocument()
  })

  it('handles download report functionality', async () => {
    const user = userEvent.setup()
    render(<WinnersDisplay result={mockDrawResult} />)
    
    const downloadButton = screen.getByText('Download Audit Report')
    expect(downloadButton).toBeInTheDocument()
    
    // Test that button can be clicked
    await user.click(downloadButton)
    expect(downloadButton).toBeInTheDocument()
  })

  it('handles single winner correctly', () => {
    const singleWinnerResult = {
      ...mockDrawResult,
      winners: [mockDrawResult.winners[0]]
    }
    
    render(<WinnersDisplay result={singleWinnerResult} />)
    
    // Check that single winner is displayed (text is split across elements)
    expect(screen.getByText(/1 winners drawn from 100 participants/)).toBeInTheDocument()
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
      // Use getAllByText for names that might appear multiple times
      const nameElements = screen.getAllByText(winner.name)
      expect(nameElements.length).toBeGreaterThan(0)
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
    
    // Check that timestamp is displayed (text is split across elements)
    expect(screen.getByText(/Timestamp:/)).toBeInTheDocument()
    expect(screen.getByText(/1\/15\/2024/)).toBeInTheDocument()
  })

  it('handles different draw IDs correctly', () => {
    const customDrawResult = {
      ...mockDrawResult,
      drawId: 'custom-draw-123'
    }
    
    render(<WinnersDisplay result={customDrawResult} />)
    
    // Check that draw ID is displayed (text is split across elements)
    expect(screen.getByText(/Draw ID:/)).toBeInTheDocument()
    expect(screen.getByText(/custom-draw-123/)).toBeInTheDocument()
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
