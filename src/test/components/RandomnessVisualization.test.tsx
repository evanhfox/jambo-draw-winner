import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RandomnessVisualization } from '@/components/RandomnessVisualization'

describe('RandomnessVisualization Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock setTimeout to make tests faster
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders visualization component correctly', () => {
    render(<RandomnessVisualization participantCount={10} winnerCount={7} />)
    
    expect(screen.getByText('Randomness Process Visualization')).toBeInTheDocument()
    expect(screen.getByText('See how our cryptographically secure randomization works')).toBeInTheDocument()
  })

  it('displays all three steps correctly', () => {
    render(<RandomnessVisualization participantCount={10} winnerCount={7} />)
    
    expect(screen.getByText('Generate Random Values')).toBeInTheDocument()
    expect(screen.getByText('Create cryptographically secure random numbers')).toBeInTheDocument()
    
    expect(screen.getByText('Apply Fisher-Yates Shuffle')).toBeInTheDocument()
    expect(screen.getByText('Shuffle participants using random values')).toBeInTheDocument()
    
    expect(screen.getByText('Select Winners')).toBeInTheDocument()
    expect(screen.getByText('Take first 7 from shuffled list')).toBeInTheDocument()
  })

  it('shows demonstration button when participants are available', () => {
    render(<RandomnessVisualization participantCount={10} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    expect(demoButton).toBeInTheDocument()
    expect(demoButton).not.toBeDisabled()
  })

  it('disables demonstration button when no participants', () => {
    render(<RandomnessVisualization participantCount={0} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    expect(demoButton).toBeDisabled()
  })

  it('animates through steps when demonstration is triggered', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RandomnessVisualization participantCount={10} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    await user.click(demoButton)
    
    // Check that button shows "Demonstrating Process..."
    expect(screen.getByText('Demonstrating Process...')).toBeInTheDocument()
    
    // Fast-forward through the animation
    vi.advanceTimersByTime(1000) // First step
    vi.advanceTimersByTime(1000) // Second step
    vi.advanceTimersByTime(1000) // Third step
    
    await waitFor(() => {
      expect(screen.getByText('Demonstrate Randomization Process')).toBeInTheDocument()
    })
  })

  it('shows shuffle result after demonstration', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RandomnessVisualization participantCount={10} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    await user.click(demoButton)
    
    // Fast-forward through the animation
    vi.advanceTimersByTime(3000)
    
    await waitFor(() => {
      expect(screen.getByText('Example Shuffle Result:')).toBeInTheDocument()
      expect(screen.getByText(/First 7 positions \(highlighted\) would be selected as winners/)).toBeInTheDocument()
    })
  })

  it('handles large participant counts correctly', () => {
    render(<RandomnessVisualization participantCount={1000} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    expect(demoButton).toBeInTheDocument()
    expect(demoButton).not.toBeDisabled()
  })

  it('shows technical notes about the demonstration', () => {
    render(<RandomnessVisualization participantCount={10} />)
    
    expect(screen.getByText(/This is a simplified demonstration/)).toBeInTheDocument()
    expect(screen.getByText(/Cryptographically secure random values/)).toBeInTheDocument()
    expect(screen.getByText(/OS-level entropy sources for true randomness/)).toBeInTheDocument()
    expect(screen.getByText(/Mathematically proven unbiased Fisher-Yates algorithm/)).toBeInTheDocument()
  })

  it('displays correct step icons', () => {
    render(<RandomnessVisualization participantCount={10} />)
    
    // Check that icons are present (they should be rendered as SVG elements)
    const stepElements = screen.getAllByText(/Generate Random Values|Apply Fisher-Yates Shuffle|Select Winners/)
    expect(stepElements).toHaveLength(3)
  })

  it('handles step animation states correctly', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RandomnessVisualization participantCount={10} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    await user.click(demoButton)
    
    // Check initial state - first step should be active
    vi.advanceTimersByTime(500)
    const firstStep = screen.getByText('Generate Random Values').closest('div')
    expect(firstStep).toHaveClass('bg-accent/10')
    
    // Check second step
    vi.advanceTimersByTime(1000)
    const secondStep = screen.getByText('Apply Fisher-Yates Shuffle').closest('div')
    expect(secondStep).toHaveClass('bg-accent/10')
    
    // Check third step
    vi.advanceTimersByTime(1000)
    const thirdStep = screen.getByText('Select Winners').closest('div')
    expect(thirdStep).toHaveClass('bg-accent/10')
  })

  it('shows completed steps with checkmark icons', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RandomnessVisualization participantCount={10} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    await user.click(demoButton)
    
    // Fast-forward through all steps
    vi.advanceTimersByTime(3000)
    
    await waitFor(() => {
      // All steps should show as completed
      const completedSteps = screen.getAllByText(/Generate Random Values|Apply Fisher-Yates Shuffle|Select Winners/)
      completedSteps.forEach(step => {
        const stepElement = step.closest('div')
        expect(stepElement).toHaveClass('bg-green-50')
      })
    })
  })

  it('handles edge case with exactly 7 participants', () => {
    render(<RandomnessVisualization participantCount={7} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    expect(demoButton).toBeInTheDocument()
    expect(demoButton).not.toBeDisabled()
  })

  it('handles edge case with exactly 6 participants', () => {
    render(<RandomnessVisualization participantCount={6} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    expect(demoButton).toBeInTheDocument()
    expect(demoButton).not.toBeDisabled()
  })

  it('shows correct number of example participants in shuffle result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RandomnessVisualization participantCount={25} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    await user.click(demoButton)
    
    // Fast-forward through the animation
    vi.advanceTimersByTime(3000)
    
    await waitFor(() => {
      expect(screen.getByText('Example Shuffle Result:')).toBeInTheDocument()
      // Should show first 10 positions plus "+X more" for the rest
      expect(screen.getByText(/\+15 more/)).toBeInTheDocument()
    })
  })

  it('handles very small participant counts in shuffle result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RandomnessVisualization participantCount={5} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    await user.click(demoButton)
    
    // Fast-forward through the animation
    vi.advanceTimersByTime(3000)
    
    await waitFor(() => {
      expect(screen.getByText('Example Shuffle Result:')).toBeInTheDocument()
      // Should show all 5 positions without "+X more"
      expect(screen.queryByText(/\+.*more/)).not.toBeInTheDocument()
    })
  })

  it('maintains accessibility with proper button states', () => {
    render(<RandomnessVisualization participantCount={10} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    expect(demoButton).toBeInTheDocument()
    expect(demoButton).not.toBeDisabled()
    
    // Button should be accessible
    expect(demoButton).toBeInTheDocument()
  })

  it('handles rapid clicking on demonstration button', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RandomnessVisualization participantCount={10} winnerCount={7} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    
    // Click multiple times rapidly
    await user.click(demoButton)
    await user.click(demoButton)
    await user.click(demoButton)
    
    // Should still work correctly
    expect(screen.getByText('Demonstrating Process...')).toBeInTheDocument()
  })

  it('displays correct winner count in step description', () => {
    render(<RandomnessVisualization participantCount={10} winnerCount={3} />)
    
    expect(screen.getByText('Take first 3 from shuffled list')).toBeInTheDocument()
  })

  it('displays correct winner count in shuffle result', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<RandomnessVisualization participantCount={10} winnerCount={5} />)
    
    const demoButton = screen.getByRole('button', { name: /Demonstrate Randomization Process/i })
    await user.click(demoButton)
    
    // Fast-forward through the animation
    vi.advanceTimersByTime(3000)
    
    await waitFor(() => {
      expect(screen.getByText(/First 5 positions \(highlighted\) would be selected as winners/)).toBeInTheDocument()
    })
  })

  it('handles single winner correctly', () => {
    render(<RandomnessVisualization participantCount={10} winnerCount={1} />)
    
    expect(screen.getByText('Take first 1 from shuffled list')).toBeInTheDocument()
  })
})
