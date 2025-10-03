import { vi } from 'vitest'

// Mock crypto for consistent testing
export const mockCrypto = {
  getRandomValues: vi.fn(),
  randomUUID: vi.fn()
}

// Mock URL methods for download testing
export const mockURL = {
  createObjectURL: vi.fn(),
  revokeObjectURL: vi.fn()
}

// Mock document methods for download testing
export const mockDocument = {
  createElement: vi.fn()
}

// Mock canvas-confetti
export const mockConfetti = vi.fn()

// Mock sonner toast
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn()
}

// Setup function for tests
export function setupTestMocks() {
  // Setup crypto mock
  Object.defineProperty(global, 'crypto', {
    value: mockCrypto,
    configurable: true
  })

  // Setup URL mock
  Object.defineProperty(global, 'URL', {
    value: mockURL,
    configurable: true
  })

  // Setup document mock
  Object.defineProperty(document, 'createElement', {
    value: mockDocument,
    configurable: true
  })

  // Setup canvas-confetti mock
  vi.mock('canvas-confetti', () => ({
    default: mockConfetti
  }))

  // Setup sonner mock
  vi.mock('sonner', () => ({
    toast: mockToast
  }))
}

// Cleanup function for tests
export function cleanupTestMocks() {
  vi.clearAllMocks()
}

// Test data generators
export const testData = {
  participants: [
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
  ],

  generateParticipants: (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`
    }))
  },

  generateCSVContent: (participants: Array<{ name: string; email: string }>) => {
    return participants.map(p => `${p.name},${p.email}`).join('\n')
  },

  createCSVFile: (content: string, filename = 'participants.csv') => {
    return new File([content], filename, { type: 'text/csv' })
  }
}

// Utility functions for testing
export const testUtils = {
  // Wait for async operations
  waitFor: (callback: () => void, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      const check = () => {
        try {
          callback()
          resolve(undefined)
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error)
          } else {
            setTimeout(check, 10)
          }
        }
      }
      check()
    })
  },

  // Mock file upload
  mockFileUpload: (file: File, inputElement: HTMLInputElement) => {
    const event = new Event('change', { bubbles: true })
    Object.defineProperty(event, 'target', {
      value: { files: [file] }
    })
    inputElement.dispatchEvent(event)
  },

  // Mock drag and drop
  mockDragDrop: (file: File, dropElement: HTMLElement) => {
    const event = new Event('drop', { bubbles: true })
    Object.defineProperty(event, 'dataTransfer', {
      value: { files: [file] }
    })
    dropElement.dispatchEvent(event)
  },

  // Generate random values for testing
  generateRandomValues: (length: number, seed?: number) => {
    const values = new Uint32Array(length)
    const random = seed ? () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    } : Math.random

    for (let i = 0; i < length; i++) {
      values[i] = Math.floor(random() * 4294967296)
    }
    return values
  }
}

// Test assertions helpers
export const testAssertions = {
  // Check if element has proper accessibility attributes
  hasAccessibilityAttributes: (element: HTMLElement) => {
    const hasRole = element.hasAttribute('role') || element.tagName === 'BUTTON' || element.tagName === 'INPUT'
    const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby') || element.textContent?.trim()
    return hasRole && hasLabel
  },

  // Check if element is properly styled
  hasProperStyling: (element: HTMLElement) => {
    const computedStyle = window.getComputedStyle(element)
    return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden'
  },

  // Check if element is interactive
  isInteractive: (element: HTMLElement) => {
    return element.tagName === 'BUTTON' || 
           element.tagName === 'INPUT' || 
           element.tagName === 'SELECT' ||
           element.tagName === 'TEXTAREA' ||
           element.hasAttribute('onclick') ||
           element.hasAttribute('onkeydown')
  }
}

// Performance testing helpers
export const performanceUtils = {
  // Measure execution time
  measureTime: async (fn: () => Promise<void> | void) => {
    const start = performance.now()
    await fn()
    const end = performance.now()
    return end - start
  },

  // Check if operation completes within time limit
  completesWithinTime: async (fn: () => Promise<void> | void, maxTime: number) => {
    const time = await performanceUtils.measureTime(fn)
    return time <= maxTime
  }
}

// Mock data for different scenarios
export const mockScenarios = {
  // Valid draw result
  validDrawResult: {
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
  },

  // Edge cases
  edgeCases: {
    emptyParticipants: [],
    singleParticipant: [{ name: 'John Doe', email: 'john@example.com' }],
    exactlySevenParticipants: Array.from({ length: 7 }, (_, i) => ({
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`
    })),
    largeParticipantList: Array.from({ length: 1000 }, (_, i) => ({
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`
    })),
    specialCharacters: [
      { name: 'José María', email: 'jose@example.com' },
      { name: 'François', email: 'francois@example.com' },
      { name: '李小明', email: 'li@example.com' },
      { name: 'Александр', email: 'alex@example.com' },
      { name: 'محمد', email: 'mohammed@example.com' }
    ]
  }
}
