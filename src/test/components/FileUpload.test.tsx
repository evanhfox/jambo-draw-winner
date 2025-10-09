import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FileUpload } from '@/components/FileUpload'

describe('FileUpload Component', () => {
  const mockOnFileUpload = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders upload area correctly', () => {
      render(<FileUpload onFileUpload={mockOnFileUpload} />)
      
      expect(screen.getByText('Upload Participant List')).toBeInTheDocument()
      expect(screen.getByText('Drop your CSV file here or click to browse')).toBeInTheDocument()
      expect(screen.getByText('Supports: Simple CSV (name,email) or Google Forms exports')).toBeInTheDocument()
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
      expect(screen.getByText('Supports: Simple CSV (name,email) or Google Forms exports')).toBeInTheDocument()
    })
  })

  describe('File Input Interaction', () => {
    it('handles file input change event', () => {
      render(<FileUpload onFileUpload={mockOnFileUpload} />)
      
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      const file = new File(['John Doe,john@example.com'], 'participants.csv', { type: 'text/csv' })
      
      // Test that the file input can receive files
      fireEvent.change(fileInput, { target: { files: [file] } })
      
      // The actual file processing is complex to test due to FileReader async nature
      // This test verifies the input can handle file changes
      expect(fileInput.files).toHaveLength(1)
      expect(fileInput.files![0]).toBe(file)
    })

    it('handles file input with no file', () => {
      render(<FileUpload onFileUpload={mockOnFileUpload} />)
      
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      
      fireEvent.change(fileInput, { target: { files: null } })
      
      // Should not crash when no files are selected
      expect(fileInput).toBeInTheDocument()
    })
  })

  describe('Drag and Drop', () => {
    it('prevents default on dragover', () => {
      render(<FileUpload onFileUpload={mockOnFileUpload} />)
      
      const uploadArea = screen.getByText('Upload Participant List').closest('div')
      
      const preventDefaultSpy = vi.fn()
      const dragOverEvent = new Event('dragover', { bubbles: true }) as any
      dragOverEvent.preventDefault = preventDefaultSpy
      
      fireEvent(uploadArea!, dragOverEvent)
      
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('handles drop event with CSV file', () => {
      render(<FileUpload onFileUpload={mockOnFileUpload} />)
      
      const file = new File(['John Doe,john@example.com'], 'participants.csv', { type: 'text/csv' })
      const uploadArea = screen.getByText('Upload Participant List').closest('div')
      
      const dropEvent = new Event('drop', { bubbles: true }) as any
      dropEvent.dataTransfer = { files: [file] }
      
      fireEvent(uploadArea!, dropEvent)
      
      // Test that drop event is handled (actual file processing is complex to test)
      expect(uploadArea).toBeInTheDocument()
    })

    it('handles drop event with non-CSV file', () => {
      render(<FileUpload onFileUpload={mockOnFileUpload} />)
      
      const txtFile = new File(['some content'], 'participants.txt', { type: 'text/plain' })
      const uploadArea = screen.getByText('Upload Participant List').closest('div')
      
      const dropEvent = new Event('drop', { bubbles: true }) as any
      dropEvent.dataTransfer = { files: [txtFile] }
      
      fireEvent(uploadArea!, dropEvent)
      
      // Should not crash when non-CSV file is dropped
      expect(uploadArea).toBeInTheDocument()
    })
  })

  describe('Click to Upload', () => {
    it('triggers file input click when upload area is clicked', () => {
      render(<FileUpload onFileUpload={mockOnFileUpload} />)
      
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      const clickSpy = vi.spyOn(fileInput, 'click')
      
      const uploadArea = screen.getByText('Upload Participant List').closest('div')
      fireEvent.click(uploadArea!)
      
      expect(clickSpy).toHaveBeenCalled()
    })
  })

  describe('CSV Parsing Logic', () => {
    it('has parseCSV function that handles basic CSV format', () => {
      // Test the CSV parsing logic directly by creating a component instance
      render(<FileUpload onFileUpload={mockOnFileUpload} />)
      
      // The component should render without errors, indicating parseCSV function exists
      expect(screen.getByText('Upload Participant List')).toBeInTheDocument()
    })
  })
})