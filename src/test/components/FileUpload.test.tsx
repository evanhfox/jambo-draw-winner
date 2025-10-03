import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload } from '@/components/FileUpload'

describe('FileUpload Component', () => {
  const mockOnFileUpload = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders upload area correctly', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    expect(screen.getByText('Upload Participant List')).toBeInTheDocument()
    expect(screen.getByText('Drop your CSV file here or click to browse')).toBeInTheDocument()
    expect(screen.getByText('Format: name,email (one per line)')).toBeInTheDocument()
  })

  it('has hidden file input', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const fileInput = screen.getByRole('textbox', { hidden: true }) as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput.type).toBe('file')
    expect(fileInput.accept).toBe('.csv')
  })

  it('opens file dialog when clicked', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const uploadArea = screen.getByText('Upload Participant List').closest('div')
    expect(uploadArea).toBeInTheDocument()
    
    // Mock file input click
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    const clickSpy = vi.spyOn(fileInput, 'click')
    
    await user.click(uploadArea!)
    expect(clickSpy).toHaveBeenCalled()
  })

  it('handles file selection correctly', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const csvContent = 'John Doe,john@example.com\nJane Smith,jane@example.com'
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ])
    })
  })

  it('handles drag and drop correctly', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const csvContent = 'Alice Johnson,alice@example.com\nBob Wilson,bob@example.com'
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    
    const uploadArea = screen.getByText('Upload Participant List').closest('div')
    
    fireEvent.drop(uploadArea!, {
      dataTransfer: {
        files: [file]
      }
    })
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith([
        { name: 'Alice Johnson', email: 'alice@example.com' },
        { name: 'Bob Wilson', email: 'bob@example.com' }
      ])
    })
  })

  it('prevents default on dragover', () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const uploadArea = screen.getByText('Upload Participant List').closest('div')
    const preventDefaultSpy = vi.fn()
    
    fireEvent.dragOver(uploadArea!, {
      preventDefault: preventDefaultSpy
    })
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('ignores non-CSV files in drag and drop', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const txtFile = new File(['some content'], 'participants.txt', { type: 'text/plain' })
    const uploadArea = screen.getByText('Upload Participant List').closest('div')
    
    fireEvent.drop(uploadArea!, {
      dataTransfer: {
        files: [txtFile]
      }
    })
    
    // Should not call onFileUpload for non-CSV files
    expect(mockOnFileUpload).not.toHaveBeenCalled()
  })

  it('ignores non-CSV files in file input', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const txtFile = new File(['some content'], 'participants.txt', { type: 'text/plain' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    
    await user.upload(fileInput, txtFile)
    
    // Should not call onFileUpload for non-CSV files
    expect(mockOnFileUpload).not.toHaveBeenCalled()
  })

  it('handles empty CSV file', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const emptyFile = new File([''], 'empty.csv', { type: 'text/csv' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    
    await user.upload(fileInput, emptyFile)
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith([])
    })
  })

  it('handles CSV with empty lines', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const csvContent = 'John Doe,john@example.com\n\nJane Smith,jane@example.com\n\n'
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ])
    })
  })

  it('handles CSV with extra whitespace', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const csvContent = '  John Doe  ,  john@example.com  \n  Jane Smith  ,  jane@example.com  '
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ])
    })
  })

  it('handles CSV with missing email', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const csvContent = 'John Doe,john@example.com\nJane Smith\nBob Wilson,bob@example.com'
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Bob Wilson', email: 'bob@example.com' }
      ])
    })
  })

  it('handles CSV with missing name', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    const csvContent = 'John Doe,john@example.com\n,jane@example.com\nBob Wilson,bob@example.com'
    const file = new File([csvContent], 'participants.csv', { type: 'text/csv' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledWith([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Bob Wilson', email: 'bob@example.com' }
      ])
    })
  })

  it('handles large CSV files', async () => {
    render(<FileUpload onFileUpload={mockOnFileUpload} />)
    
    // Generate a large CSV with 1000 participants
    const participants = Array.from({ length: 1000 }, (_, i) => 
      `Participant ${i + 1},participant${i + 1}@example.com`
    ).join('\n')
    
    const file = new File([participants], 'large.csv', { type: 'text/csv' })
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    
    await user.upload(fileInput, file)
    
    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalled()
      const calledWith = mockOnFileUpload.mock.calls[0][0]
      expect(calledWith).toHaveLength(1000)
      expect(calledWith[0]).toEqual({ name: 'Participant 1', email: 'participant1@example.com' })
      expect(calledWith[999]).toEqual({ name: 'Participant 1000', email: 'participant1000@example.com' })
    })
  })
})
