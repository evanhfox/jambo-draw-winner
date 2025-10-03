import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock crypto for testing
const mockCrypto = {
  getRandomValues: vi.fn(),
  randomUUID: vi.fn()
}

Object.defineProperty(global, 'crypto', {
  value: mockCrypto
})

// Import the draw logic (we'll extract this from the main component)
interface Participant {
  name: string
  email: string
}

interface DrawResult {
  winners: Participant[]
  timestamp: string
  totalParticipants: number
  drawId: string
}

// Extracted draw logic for testing
function performDraw(participants: Participant[]): DrawResult {
  if (participants.length < 7) {
    throw new Error('Need at least 7 participants to draw 7 winners')
  }

  // Cryptographically secure random selection
  const shuffled = [...participants]
  const array = new Uint32Array(shuffled.length)
  crypto.getRandomValues(array)
  
  // Fisher-Yates shuffle with crypto random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = array[i] % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const winners = shuffled.slice(0, 7)
  const drawId = crypto.randomUUID().slice(0, 8)
  
  return {
    winners,
    timestamp: new Date().toISOString(),
    totalParticipants: participants.length,
    drawId
  }
}

describe('Draw Logic', () => {
  const mockParticipants: Participant[] = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' },
    { name: 'Diana', email: 'diana@example.com' },
    { name: 'Eve', email: 'eve@example.com' },
    { name: 'Frank', email: 'frank@example.com' },
    { name: 'Grace', email: 'grace@example.com' },
    { name: 'Henry', email: 'henry@example.com' },
    { name: 'Ivy', email: 'ivy@example.com' },
    { name: 'Jack', email: 'jack@example.com' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock crypto.getRandomValues to return predictable values for testing
    mockCrypto.getRandomValues.mockImplementation((arr: Uint32Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = i + 1 // Simple predictable pattern for testing
      }
      return arr
    })
    mockCrypto.randomUUID.mockReturnValue('test-uuid-12345678')
  })

  describe('performDraw', () => {
    it('should throw error when participants are less than 7', () => {
      const fewParticipants = mockParticipants.slice(0, 5)
      expect(() => performDraw(fewParticipants)).toThrow('Need at least 7 participants to draw 7 winners')
    })

    it('should return exactly 7 winners', () => {
      const result = performDraw(mockParticipants)
      expect(result.winners).toHaveLength(7)
    })

    it('should return all winners from the original participants', () => {
      const result = performDraw(mockParticipants)
      const winnerNames = result.winners.map(w => w.name)
      const participantNames = mockParticipants.map(p => p.name)
      
      winnerNames.forEach(name => {
        expect(participantNames).toContain(name)
      })
    })

    it('should not have duplicate winners', () => {
      const result = performDraw(mockParticipants)
      const winnerNames = result.winners.map(w => w.name)
      const uniqueNames = new Set(winnerNames)
      expect(uniqueNames.size).toBe(winnerNames.length)
    })

    it('should include timestamp and draw ID', () => {
      const result = performDraw(mockParticipants)
      expect(result.timestamp).toBeDefined()
      expect(result.drawId).toBeDefined()
      expect(result.drawId).toBe('test-uuid')
      expect(new Date(result.timestamp)).toBeInstanceOf(Date)
    })

    it('should include total participants count', () => {
      const result = performDraw(mockParticipants)
      expect(result.totalParticipants).toBe(mockParticipants.length)
    })

    it('should call crypto.getRandomValues with correct array size', () => {
      performDraw(mockParticipants)
      expect(mockCrypto.getRandomValues).toHaveBeenCalledWith(
        expect.objectContaining({
          length: mockParticipants.length
        })
      )
    })

    it('should call crypto.randomUUID for draw ID', () => {
      performDraw(mockParticipants)
      expect(mockCrypto.randomUUID).toHaveBeenCalled()
    })

    it('should produce different results with different random values', () => {
      // First call with pattern 1,2,3...
      const result1 = performDraw(mockParticipants)
      
      // Second call with pattern 10,20,30...
      mockCrypto.getRandomValues.mockImplementation((arr: Uint32Array) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = (i + 1) * 10
        }
        return arr
      })
      
      const result2 = performDraw(mockParticipants)
      
      // Results should be different due to different random values
      expect(result1.winners).not.toEqual(result2.winners)
    })
  })

  describe('Fisher-Yates Shuffle Algorithm', () => {
    it('should maintain all original elements', () => {
      const original = [...mockParticipants]
      const result = performDraw(mockParticipants)
      
      // All winners should be from original participants
      result.winners.forEach(winner => {
        expect(original).toContainEqual(winner)
      })
    })

    it('should produce unbiased distribution over multiple runs', () => {
      const runs = 1000
      const selectionCounts = new Map<string, number>()
      
      // Initialize counts
      mockParticipants.forEach(p => {
        selectionCounts.set(p.name, 0)
      })
      
      // Run multiple draws
      for (let i = 0; i < runs; i++) {
        // Use different random values for each run
        mockCrypto.getRandomValues.mockImplementation((arr: Uint32Array) => {
          for (let j = 0; j < arr.length; j++) {
            arr[j] = Math.floor(Math.random() * 4294967296)
          }
          return arr
        })
        
        const result = performDraw(mockParticipants)
        result.winners.forEach(winner => {
          selectionCounts.set(winner.name, (selectionCounts.get(winner.name) || 0) + 1)
        })
      }
      
      // Each participant should be selected roughly equally
      const expectedSelections = (runs * 7) / mockParticipants.length
      const tolerance = expectedSelections * 0.2 // 20% tolerance
      
      selectionCounts.forEach((count, name) => {
        expect(count).toBeGreaterThanOrEqual(expectedSelections - tolerance)
        expect(count).toBeLessThanOrEqual(expectedSelections + tolerance)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle exactly 7 participants', () => {
      const exactlySeven = mockParticipants.slice(0, 7)
      const result = performDraw(exactlySeven)
      expect(result.winners).toHaveLength(7)
      expect(result.totalParticipants).toBe(7)
    })

    it('should handle large number of participants', () => {
      const largeParticipantList = Array.from({ length: 1000 }, (_, i) => ({
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`
      }))
      
      const result = performDraw(largeParticipantList)
      expect(result.winners).toHaveLength(7)
      expect(result.totalParticipants).toBe(1000)
    })

    it('should handle participants with special characters in names', () => {
      const specialParticipants = [
        { name: 'José María', email: 'jose@example.com' },
        { name: 'François', email: 'francois@example.com' },
        { name: '李小明', email: 'li@example.com' },
        { name: 'Александр', email: 'alex@example.com' },
        { name: 'محمد', email: 'mohammed@example.com' },
        { name: '山田太郎', email: 'yamada@example.com' },
        { name: 'José María', email: 'jose2@example.com' }
      ]
      
      const result = performDraw(specialParticipants)
      expect(result.winners).toHaveLength(7)
      expect(result.totalParticipants).toBe(7)
    })
  })
})
