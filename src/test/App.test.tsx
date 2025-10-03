import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '@/App'

// Mock the pages to avoid complex rendering
vi.mock('@/pages/Index', () => ({
  default: () => <div data-testid="index-page">Index Page</div>
}))

vi.mock('@/pages/NotFound', () => ({
  default: () => <div data-testid="not-found-page">404 - Page Not Found</div>
}))

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock UI components
vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />
}))

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="sonner-toaster" />
}))

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock react-router-dom to avoid router conflicts
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div data-testid="route">{element}</div>
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Router Configuration', () => {
    it('renders router components', () => {
      render(<App />)
      
      expect(screen.getByTestId('browser-router')).toBeInTheDocument()
      expect(screen.getByTestId('routes')).toBeInTheDocument()
      expect(screen.getAllByTestId('route')).toHaveLength(2) // Index and NotFound routes
    })

    it('renders Index page', () => {
      render(<App />)
      
      expect(screen.getByTestId('index-page')).toBeInTheDocument()
      expect(screen.getByText('Index Page')).toBeInTheDocument()
    })
  })

  describe('Provider Setup', () => {
    it('renders with all required providers', () => {
      render(<App />)
      
      // Check that the main page is rendered (indicating providers are working)
      expect(screen.getByTestId('index-page')).toBeInTheDocument()
    })

    it('includes toast components', () => {
      render(<App />)
      
      // Toast components should be present (though they might not be visible)
      expect(screen.getByTestId('toaster')).toBeInTheDocument()
      expect(screen.getByTestId('sonner-toaster')).toBeInTheDocument()
    })
  })
})
