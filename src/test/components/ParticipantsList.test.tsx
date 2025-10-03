import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ParticipantsList } from '@/components/ParticipantsList'

describe('ParticipantsList Component', () => {
  const mockParticipants = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' },
    { name: 'Alice Brown', email: 'alice@example.com' },
    { name: 'Charlie Wilson', email: 'charlie@example.com' }
  ]

  it('renders participants list correctly', () => {
    render(<ParticipantsList participants={mockParticipants} />)
    
    expect(screen.getByText('Participants')).toBeInTheDocument()
    expect(screen.getByText('5 total entries')).toBeInTheDocument()
  })

  it('displays all participants with names and emails', () => {
    render(<ParticipantsList participants={mockParticipants} />)
    
    mockParticipants.forEach(participant => {
      expect(screen.getByText(participant.name)).toBeInTheDocument()
      expect(screen.getByText(participant.email)).toBeInTheDocument()
    })
  })

  it('handles empty participants list', () => {
    render(<ParticipantsList participants={[]} />)
    
    expect(screen.getByText('Participants')).toBeInTheDocument()
    expect(screen.getByText('0 total entries')).toBeInTheDocument()
  })

  it('handles single participant', () => {
    const singleParticipant = [mockParticipants[0]]
    render(<ParticipantsList participants={singleParticipant} />)
    
    expect(screen.getByText('Participants')).toBeInTheDocument()
    expect(screen.getByText(/1 total entries/)).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('handles large number of participants', () => {
    const largeParticipantList = Array.from({ length: 100 }, (_, i) => ({
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`
    }))
    
    render(<ParticipantsList participants={largeParticipantList} />)
    
    expect(screen.getByText('Participants')).toBeInTheDocument()
    expect(screen.getByText('100 total entries')).toBeInTheDocument()
    
    // Check that first and last participants are visible
    expect(screen.getByText('Participant 1')).toBeInTheDocument()
    expect(screen.getByText('participant1@example.com')).toBeInTheDocument()
  })

  it('handles participants with special characters in names', () => {
    const specialParticipants = [
      { name: 'José María', email: 'jose@example.com' },
      { name: 'François', email: 'francois@example.com' },
      { name: '李小明', email: 'li@example.com' },
      { name: 'Александр', email: 'alex@example.com' },
      { name: 'محمد', email: 'mohammed@example.com' }
    ]
    
    render(<ParticipantsList participants={specialParticipants} />)
    
    expect(screen.getByText('5 total entries')).toBeInTheDocument()
    specialParticipants.forEach(participant => {
      expect(screen.getByText(participant.name)).toBeInTheDocument()
      expect(screen.getByText(participant.email)).toBeInTheDocument()
    })
  })

  it('handles participants with long names and emails', () => {
    const longParticipants = [
      { 
        name: 'Very Long Name That Might Cause Layout Issues In The UI Component', 
        email: 'very.long.email.address.that.might.cause.layout.issues@verylongdomainname.com' 
      },
      { 
        name: 'Another Very Long Name With Many Words And Characters', 
        email: 'another.very.long.email@anotherverylongdomainname.com' 
      }
    ]
    
    render(<ParticipantsList participants={longParticipants} />)
    
    expect(screen.getByText('2 total entries')).toBeInTheDocument()
    longParticipants.forEach(participant => {
      expect(screen.getByText(participant.name)).toBeInTheDocument()
      expect(screen.getByText(participant.email)).toBeInTheDocument()
    })
  })

  it('has scrollable container for large lists', () => {
    const largeParticipantList = Array.from({ length: 50 }, (_, i) => ({
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`
    }))
    
    render(<ParticipantsList participants={largeParticipantList} />)
    
    const scrollContainer = screen.getByText('Participant 1').closest('.max-h-\\[400px\\]')
    expect(scrollContainer).toBeInTheDocument()
    expect(scrollContainer).toHaveClass('overflow-y-auto')
  })

  it('displays participants in correct order', () => {
    render(<ParticipantsList participants={mockParticipants} />)
    
    const participantElements = screen.getAllByText(/Participant|John|Jane|Bob|Alice|Charlie/)
    const participantNames = participantElements
      .filter(el => el.textContent && mockParticipants.some(p => p.name === el.textContent))
      .map(el => el.textContent)
    
    expect(participantNames).toEqual(mockParticipants.map(p => p.name))
  })

  it('handles duplicate names correctly', () => {
    const duplicateParticipants = [
      { name: 'John Doe', email: 'john1@example.com' },
      { name: 'John Doe', email: 'john2@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ]
    
    render(<ParticipantsList participants={duplicateParticipants} />)
    
    expect(screen.getByText('3 total entries')).toBeInTheDocument()
    expect(screen.getAllByText('John Doe')).toHaveLength(2)
    expect(screen.getByText('john1@example.com')).toBeInTheDocument()
    expect(screen.getByText('john2@example.com')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('handles participants with empty names or emails', () => {
    const edgeCaseParticipants = [
      { name: '', email: 'empty@example.com' },
      { name: 'No Email', email: '' },
      { name: 'Normal User', email: 'normal@example.com' }
    ]
    
    render(<ParticipantsList participants={edgeCaseParticipants} />)
    
    expect(screen.getByText('3 total entries')).toBeInTheDocument()
    expect(screen.getByText('empty@example.com')).toBeInTheDocument()
    expect(screen.getByText('No Email')).toBeInTheDocument()
    expect(screen.getByText('Normal User')).toBeInTheDocument()
    expect(screen.getByText('normal@example.com')).toBeInTheDocument()
  })
})
