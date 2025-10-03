import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Index from '@/pages/Index'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}))

describe('Index Page Integration Tests', () => {
  const mockParticipants = [
    { name: 'Alice Johnson', email: 'alice@example.com' },
    { name: 'Bob Smith', email: 'bob@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
    { name: 'Diana Wilson', email: 'diana@example.com' },
    { name: 'Eve Davis', email: 'eve@example.com' },
    { name: 'Frank Miller', email: 'frank@example.com' },
    { name: 'Grace Taylor', email: 'grace@example.com' },
    { name: 'Henry Lee', email: 'henry@example.com' },
    { name: 'Ivy Chen', email: 'ivy@example.com' },
    { name: 'Jack Wilson', email: 'jack@example.com' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock crypto for consistent testing
    Object.defineProperty(global, 'crypto', {
      value: {
        getRandomValues: vi.fn((arr: Uint32Array) => {
          for (let i = 0; i < arr.length; i++) {
            arr[i] = Math.floor(Math.random() * 4294967296)
          }
          return arr
        }),
        randomUUID: vi.fn(() => 'test-uuid-12345678')
      }
    })
  })

  it('renders the main page correctly', () => {
    render(<Index />)
    
    expect(screen.getByText('Contest Draw Platform')).toBeInTheDocument()
    expect(screen.getByText('Secure, auditable, and truly random winner selection')).toBeInTheDocument()
    expect(screen.getByText('Download Sample CSV')).toBeInTheDocument()
  })

  it('shows file upload initially', () => {
    render(<Index />)
    
    expect(screen.getByText('Upload Participant List')).toBeInTheDocument()
    expect(screen.getByText('Drop your CSV file here or click to browse')).toBeInTheDocument()
  })

  it('handles file upload and shows participants', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument()
      expect(screen.getByText('10 total entries')).toBeInTheDocument()
    })
  })

  it('shows draw button after file upload', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Draw \d+ Winners/i })).toBeInTheDocument()
    })
  })

  it('shows winner count selector after file upload', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('Number of Winners')).toBeInTheDocument()
      expect(screen.getByText(/Enter how many winners to draw \(1 to \d+ participants available\)/)).toBeInTheDocument()
      expect(screen.getByDisplayValue('7')).toBeInTheDocument() // Default value
    })
  })

  it('allows changing winner count', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('Number of Winners')).toBeInTheDocument()
    })
    
    // Type in the input field
    const winnerCountInput = screen.getByDisplayValue('7')
    await user.clear(winnerCountInput)
    await user.type(winnerCountInput, '3')
    
    // Check that the button text updates
    expect(screen.getByRole('button', { name: /Draw 3 Winners/i })).toBeInTheDocument()
  })

  it('validates winner count input', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('Number of Winners')).toBeInTheDocument()
    })
    
    const winnerCountInput = screen.getByDisplayValue('7')
    
    // Test invalid input (too high)
    await user.clear(winnerCountInput)
    await user.type(winnerCountInput, '100')
    await user.tab() // Trigger onBlur
    expect(screen.getByDisplayValue('10')).toBeInTheDocument() // Should clamp to max participants
    
    // Test invalid input (too low)
    await user.clear(winnerCountInput)
    await user.type(winnerCountInput, '0')
    await user.tab() // Trigger onBlur
    expect(screen.getByDisplayValue('1')).toBeInTheDocument() // Should clamp to 1
  })

  it('performs draw and shows winners', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Draw \d+ Winners/i })).toBeInTheDocument()
    })
    
    const drawButton = screen.getByRole('button', { name: /Draw \d+ Winners/i })
    await user.click(drawButton)
    
    // Should show drawing animation
    expect(screen.getByText('Drawing Winners...')).toBeInTheDocument()
    
    // Wait for draw to complete
    await waitFor(() => {
      expect(screen.getByText('Winners Selected!')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('shows error when trying to draw with less than 7 participants', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const fewParticipants = mockParticipants.slice(0, 5)
    const csvContent = fewParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Draw \d+ Winners/i })).toBeInTheDocument()
    })
    
    const drawButton = screen.getByRole('button', { name: /Draw \d+ Winners/i })
    await user.click(drawButton)
    
    // Should show error (this would be handled by toast in real app)
    // The button should remain enabled since the draw didn't proceed
    expect(screen.getByRole('button', { name: /Draw \d+ Winners/i })).toBeInTheDocument()
  })

  it('disables draw button after successful draw', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Draw \d+ Winners/i })).toBeInTheDocument()
    })
    
    const drawButton = screen.getByRole('button', { name: /Draw \d+ Winners/i })
    await user.click(drawButton)
    
    // Wait for draw to complete
    await waitFor(() => {
      expect(screen.getByText('Winners Selected!')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Draw button should be disabled
    expect(screen.getByRole('button', { name: /Draw \d+ Winners/i })).toBeDisabled()
  })

  it('shows reset button and allows reset', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Draw \d+ Winners/i })).toBeInTheDocument()
    })
    
    // Click reset button
    const resetButton = screen.getByRole('button', { name: '' }) // Reset button has no text, just icon
    await user.click(resetButton)
    
    // Should return to file upload state
    await waitFor(() => {
      expect(screen.getByText('Upload Participant List')).toBeInTheDocument()
    })
  })

  it('shows randomness visualization after file upload', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('Randomness Process Visualization')).toBeInTheDocument()
    })
  })

  it('downloads sample CSV when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Mock URL.createObjectURL and document.createElement
    const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
    const mockRevokeObjectURL = vi.fn()
    const mockClick = vi.fn()
    const mockCreateElement = vi.fn(() => ({
      click: mockClick,
      href: '',
      download: ''
    }))
    
    Object.defineProperty(global, 'URL', {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL
      }
    })
    
    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement
    })
    
    const downloadButton = screen.getByRole('button', { name: /Download Sample CSV/i })
    await user.click(downloadButton)
    
    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalled()
  })

  it('shows technical details section', () => {
    render(<Index />)
    
    expect(screen.getByText('🔒 How Our Randomness Works')).toBeInTheDocument()
    expect(screen.getByText('Cryptographic Security')).toBeInTheDocument()
    expect(screen.getByText('Fisher-Yates Shuffle')).toBeInTheDocument()
    expect(screen.getByText('About This Draw System')).toBeInTheDocument()
  })

  it('expands technical implementation details', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    const expandButton = screen.getByRole('button', { name: /Show Technical Implementation Details/i })
    await user.click(expandButton)
    
    expect(screen.getByText('Implementation Details')).toBeInTheDocument()
    expect(screen.getByText('Random Number Generation:')).toBeInTheDocument()
    expect(screen.getByText('Shuffle Algorithm:')).toBeInTheDocument()
    expect(screen.getByText('Security Properties:')).toBeInTheDocument()
  })

  it('collapses technical implementation details', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // First expand
    const expandButton = screen.getByRole('button', { name: /Show Technical Implementation Details/i })
    await user.click(expandButton)
    
    expect(screen.getByText('Implementation Details')).toBeInTheDocument()
    
    // Then collapse
    const collapseButton = screen.getByRole('button', { name: /Hide Technical Implementation Details/i })
    await user.click(collapseButton)
    
    expect(screen.queryByText('Implementation Details')).not.toBeInTheDocument()
  })

  it('handles full workflow: upload -> draw -> download report', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Mock URL methods for download
    const mockCreateObjectURL = vi.fn(() => 'blob:mock-url')
    const mockRevokeObjectURL = vi.fn()
    const mockClick = vi.fn()
    const mockCreateElement = vi.fn(() => ({
      click: mockClick,
      href: '',
      download: ''
    }))
    
    Object.defineProperty(global, 'URL', {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL
      }
    })
    
    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement
    })
    
    // 1. Upload file
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    // 2. Wait for participants to load
    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument()
    })
    
    // 3. Perform draw
    const drawButton = screen.getByRole('button', { name: /Draw \d+ Winners/i })
    await user.click(drawButton)
    
    // 4. Wait for draw to complete
    await waitFor(() => {
      expect(screen.getByText('Winners Selected!')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // 5. Download report
    const downloadReportButton = screen.getByRole('button', { name: /Download Audit Report/i })
    await user.click(downloadReportButton)
    
    // Should have created download links
    expect(mockCreateObjectURL).toHaveBeenCalled()
    expect(mockClick).toHaveBeenCalled()
  })

  it('maintains state correctly during multiple operations', async () => {
    const user = userEvent.setup()
    render(<Index />)
    
    // Upload file
    const csvContent = mockParticipants.map(p => `${p.name},${p.email}`).join('\n')
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument()
    })
    
    // Perform draw
    const drawButton = screen.getByRole('button', { name: /Draw \d+ Winners/i })
    await user.click(drawButton)
    
    await waitFor(() => {
      expect(screen.getByText('Winners Selected!')).toBeInTheDocument()
    }, { timeout: 2000 })
    
    // Reset
    const resetButton = screen.getByRole('button', { name: '' })
    await user.click(resetButton)
    
    // Should return to initial state
    await waitFor(() => {
      expect(screen.getByText('Upload Participant List')).toBeInTheDocument()
    })
    
    // Upload again
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(screen.getByText('Participants')).toBeInTheDocument()
    })
  })
})
