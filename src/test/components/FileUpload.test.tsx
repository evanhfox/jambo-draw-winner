import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileUpload } from '@/components/FileUpload'

describe('FileUpload Component', () => {
  const mockOnFileUpload = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area correctly', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    expect(screen.getByText('Upload Participant List')).toBeInTheDocument()
    expect(screen.getByText('Drop your CSV file here or click to browse')).toBeInTheDocument()
    expect(screen.getByText('Format: name,email (one per line)')).toBeInTheDocument()
  })

  it('has upload icon', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    // Check that the upload icon is present (it's an SVG with upload class)
    const uploadIcon = document.querySelector('.lucide-upload')
    expect(uploadIcon).toBeInTheDocument()
  })

  it('has file input with correct attributes', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput.type).toBe('file')
    expect(fileInput.accept).toBe('.csv')
  })

  it('renders upload area with correct structure', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const uploadArea = screen.getByText('Upload Participant List').closest('div')
    expect(uploadArea).toBeInTheDocument()
  })

  it('shows correct instructions', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    expect(screen.getByText('Drop your CSV file here or click to browse')).toBeInTheDocument()
    expect(screen.getByText('Format: name,email (one per line)')).toBeInTheDocument()
  })
})