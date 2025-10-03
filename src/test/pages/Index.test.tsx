import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  beforeEach(() => {
    vi.clearAllMocks()
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

  it('shows technical details section', () => {
    render(<Index />)
    
    expect(screen.getByText('🔒 How Our Randomness Works')).toBeInTheDocument()
    expect(screen.getByText('Cryptographic Security')).toBeInTheDocument()
    expect(screen.getByText('Fisher-Yates Shuffle')).toBeInTheDocument()
    expect(screen.getByText('About This Draw System')).toBeInTheDocument()
  })

  it('shows randomness explanation', () => {
    render(<Index />)
    
    expect(screen.getByText(/We use the browser's native/)).toBeInTheDocument()
    expect(screen.getByText(/Fisher-Yates shuffle algorithm/)).toBeInTheDocument()
    expect(screen.getByText(/each participant has an equal probability/)).toBeInTheDocument()
  })

  it('shows transparency features', () => {
    render(<Index />)
    
    expect(screen.getByText(/Provides downloadable audit reports/)).toBeInTheDocument()
    expect(screen.getByText(/Generates unique draw ID/)).toBeInTheDocument()
    expect(screen.getByText(/Timestamps and tracks all draw metadata/)).toBeInTheDocument()
  })
})