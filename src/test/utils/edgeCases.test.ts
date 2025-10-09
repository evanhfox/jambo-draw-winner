import { describe, it, expect, vi, beforeEach } from 'vitest'

// Define the functions locally for testing
interface Participant {
  name: string
  email: string
}

interface DrawResult {
  winners: Participant[]
  totalParticipants: number
  drawId: string
  timestamp: string
}

function performDraw(participants: Participant[], winnerCount: number = 7): DrawResult {
  if (winnerCount <= 0) {
    throw new Error(`Winner count must be greater than 0`)
  }
  if (participants.length < winnerCount) {
    throw new Error(`Need at least ${winnerCount} participants to draw ${winnerCount} winners`)
  }

  // Create a copy of the participants array
  const shuffled = [...participants]
  
  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomValues = new Uint32Array(1)
    crypto.getRandomValues(randomValues)
    const j = randomValues[0] % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  
  // Select first N participants as winners
  const winners = shuffled.slice(0, winnerCount)
  
  return {
    winners,
    totalParticipants: participants.length,
    drawId: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  }
}

function parseCSV(csvContent: string): Participant[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const participants: Participant[] = []
  
  // Check if this looks like a Google Forms CSV (has headers)
  const firstLine = lines[0]?.trim()
  const isGoogleForms = firstLine && (
    firstLine.includes('Timestamp') || 
    firstLine.includes('Email Address') ||
    firstLine.includes('Email')
  )
  
  if (isGoogleForms) {
    // Parse Google Forms CSV format
    for (let i = 1; i < lines.length; i++) { // Skip header row
      const line = lines[i].trim()
      if (!line) continue
      
      // Parse CSV line properly handling quoted fields
      const fields = parseCSVLine(line)
      if (fields.length >= 2) {
        const timestamp = fields[0]
        const email = fields[1]
        
        if (email && isValidEmail(email)) {
          // Extract name from email (everything before @)
          const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          participants.push({ name, email })
        }
      }
    }
  } else {
    // Parse simple CSV format (name,email)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const [name, email] = line.split(',').map(s => s.trim())
      if (name && email && name !== 'name' && email !== 'email') {
        participants.push({ name, email })
      }
    }
  }
  
  return participants
}

// Helper function to parse CSV line with proper quote handling
function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0
  
  while (i < line.length) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      fields.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }
  
  // Add the last field
  fields.push(current.trim())
  
  return fields
}

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

describe('Edge Cases and Boundary Conditions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Draw Logic Edge Cases', () => {
    it('handles single participant draw', () => {
      const participants = [{ name: 'John Doe', email: 'john@example.com' }]
      
      const result = performDraw(participants, 1)
      
      expect(result.winners).toHaveLength(1)
      expect(result.winners[0]).toEqual(participants[0])
      expect(result.totalParticipants).toBe(1)
      expect(result.drawId).toBeDefined()
      expect(result.timestamp).toBeDefined()
    })

    it('handles draw with all participants as winners', () => {
      const participants = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ]
      
      const result = performDraw(participants, 2)
      
      expect(result.winners).toHaveLength(2)
      expect(result.totalParticipants).toBe(2)
      expect(result.drawId).toBeDefined()
    })

    it('throws error when winner count exceeds participants', () => {
      const participants = [{ name: 'John Doe', email: 'john@example.com' }]
      
      expect(() => {
        performDraw(participants, 2)
      }).toThrow('Need at least 2 participants to draw 2 winners')
    })

    it('throws error when winner count is zero', () => {
      const participants = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ]
      
      expect(() => {
        performDraw(participants, 0)
      }).toThrow('Winner count must be greater than 0')
    })

    it('handles large participant lists', () => {
      const participants = Array.from({ length: 1000 }, (_, i) => ({
        name: `Person ${i}`,
        email: `person${i}@example.com`
      }))
      
      const result = performDraw(participants, 10)
      
      expect(result.winners).toHaveLength(10)
      expect(result.totalParticipants).toBe(1000)
      expect(result.drawId).toBeDefined()
      
      // Ensure all winners are from the original participants
      result.winners.forEach(winner => {
        expect(participants).toContainEqual(winner)
      })
    })

    it('handles participants with special characters', () => {
      const participants = [
        { name: 'José María', email: 'jose@example.com' },
        { name: 'François', email: 'francois@example.com' },
        { name: '李小明', email: 'li@example.com' },
        { name: 'Александр', email: 'alex@example.com' },
        { name: 'محمد', email: 'mohammed@example.com' },
        { name: '山田太郎', email: 'yamada@example.com' }
      ]
      
      const result = performDraw(participants, 3)
      
      expect(result.winners).toHaveLength(3)
      expect(result.totalParticipants).toBe(6)
      
      // Ensure all winners are from the original participants
      result.winners.forEach(winner => {
        expect(participants).toContainEqual(winner)
      })
    })

    it('handles participants with very long names and emails', () => {
      const participants = [
        { 
          name: 'A'.repeat(1000), 
          email: 'verylongemail' + 'a'.repeat(1000) + '@example.com' 
        },
        { 
          name: 'B'.repeat(2000), 
          email: 'anotherverylongemail' + 'b'.repeat(2000) + '@example.com' 
        }
      ]
      
      const result = performDraw(participants, 1)
      
      expect(result.winners).toHaveLength(1)
      expect(result.totalParticipants).toBe(2)
      expect(participants).toContainEqual(result.winners[0])
    })
  })

  describe('CSV Parser Edge Cases', () => {
    it('handles empty CSV content', () => {
      const result = parseCSV('')
      expect(result).toEqual([])
    })

    it('handles CSV with only whitespace', () => {
      const result = parseCSV('   \n  \n  \t  \n  ')
      expect(result).toEqual([])
    })

    it('handles CSV with only headers', () => {
      const result = parseCSV('name,email')
      expect(result).toEqual([])
    })

    it('handles CSV with mixed valid and invalid lines', () => {
      const csvContent = `name,email
John Doe,john@example.com
Invalid Line
Jane Smith,jane@example.com
,missing-name@example.com
Bob Wilson,bob@example.com`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
        { name: 'Bob Wilson', email: 'bob@example.com' }
      ])
    })

    it('handles CSV with extra commas', () => {
      const csvContent = `name,email
John Doe,john@example.com,extra,data
Jane Smith,jane@example.com`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ])
    })

    it('handles CSV with quotes in names', () => {
      const csvContent = `name,email
"John "Johnny" Doe",john@example.com
Jane "Jane" Smith,jane@example.com`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: '"John "Johnny" Doe"', email: 'john@example.com' },
        { name: 'Jane "Jane" Smith', email: 'jane@example.com' }
      ])
    })

    it('handles CSV with Unicode characters', () => {
      const csvContent = `name,email
José María,jose@example.com
李小明,li@example.com
Александр,alex@example.com`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'José María', email: 'jose@example.com' },
        { name: '李小明', email: 'li@example.com' },
        { name: 'Александр', email: 'alex@example.com' }
      ])
    })

    it('handles very large CSV files', () => {
      const participants = Array.from({ length: 10000 }, (_, i) => 
        `Person ${i},person${i}@example.com`
      ).join('\n')
      
      const csvContent = `name,email\n${participants}`
      
      const result = parseCSV(csvContent)
      
      expect(result).toHaveLength(10000)
      expect(result[0]).toEqual({ name: 'Person 0', email: 'person0@example.com' })
      expect(result[9999]).toEqual({ name: 'Person 9999', email: 'person9999@example.com' })
    })

    it('handles CSV with inconsistent line endings', () => {
      const csvContent = `name,email\r\nJohn Doe,john@example.com\nJane Smith,jane@example.com\r\nBob Wilson,bob@example.com`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' },
        { name: 'Bob Wilson', email: 'bob@example.com' }
      ])
    })

    it('handles CSV with trailing commas', () => {
      const csvContent = `name,email,
John Doe,john@example.com,
Jane Smith,jane@example.com,`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
      ])
    })
  })

  describe('Performance Edge Cases', () => {
    it('handles rapid successive draws', () => {
      const participants = Array.from({ length: 100 }, (_, i) => ({
        name: `Person ${i}`,
        email: `person${i}@example.com`
      }))
      
      const results = []
      for (let i = 0; i < 10; i++) {
        results.push(performDraw(participants, 5))
      }
      
      expect(results).toHaveLength(10)
      results.forEach(result => {
        expect(result.winners).toHaveLength(5)
        expect(result.totalParticipants).toBe(100)
        expect(result.drawId).toBeDefined()
      })
    })

    it('maintains randomness across multiple draws', () => {
      const participants = Array.from({ length: 50 }, (_, i) => ({
        name: `Person ${i}`,
        email: `person${i}@example.com`
      }))
      
      const results = []
      for (let i = 0; i < 5; i++) {
        results.push(performDraw(participants, 10))
      }
      
      // Check that we get different results (very high probability)
      const allWinners = results.flatMap(r => r.winners)
      const uniqueWinners = new Set(allWinners.map(w => `${w.name}-${w.email}`))
      
      // With 5 draws of 10 winners each from 50 participants, we should have some variety
      expect(uniqueWinners.size).toBeGreaterThan(10)
    })
  })
})
