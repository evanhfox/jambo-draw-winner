import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test case
afterEach(() => {
  cleanup()
  // Reset mock counter for consistent test results
  mockCounter = 0
})

// Mock crypto.getRandomValues for testing
let mockCounter = 0
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint32Array) => {
      // Use deterministic values for testing
      for (let i = 0; i < arr.length; i++) {
        arr[i] = (mockCounter + i) % 4294967296
      }
      mockCounter++
      return arr
    },
    randomUUID: () => {
      // Generate deterministic UUIDs for testing
      return 'test-uuid-' + (++mockCounter).toString(36)
    }
  }
})

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn()
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock document.createElement for DOM manipulation
const originalCreateElement = document.createElement
document.createElement = vi.fn().mockImplementation((tagName) => {
  const element = originalCreateElement.call(document, tagName)
  // Mock appendChild to prevent DOM errors but still allow normal operation
  const originalAppendChild = element.appendChild
  element.appendChild = vi.fn().mockImplementation((child) => {
    return originalAppendChild.call(element, child)
  })
  const originalRemoveChild = element.removeChild
  element.removeChild = vi.fn().mockImplementation((child) => {
    return originalRemoveChild.call(element, child)
  })
  return element
})

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()
