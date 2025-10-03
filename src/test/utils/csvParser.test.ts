import { describe, it, expect } from 'vitest'

// Extracted CSV parsing logic for testing
function parseCSV(text: string): Array<{ name: string; email: string }> {
  const lines = text.split('\n').filter(line => line.trim())
  const participants: Array<{ name: string; email: string }> = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const [name, email] = line.split(',').map(s => s.trim())
    if (name && email) {
      participants.push({ name, email })
    }
  }
  
  return participants
}

describe('CSV Parser', () => {
  it('parses valid CSV correctly', () => {
    const csvContent = 'John Doe,john@example.com\nJane Smith,jane@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ])
  })

  it('handles empty CSV', () => {
    const csvContent = ''
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([])
  })

  it('handles CSV with only whitespace', () => {
    const csvContent = '   \n  \n  '
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([])
  })

  it('handles CSV with empty lines', () => {
    const csvContent = 'John Doe,john@example.com\n\nJane Smith,jane@example.com\n\n'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ])
  })

  it('handles CSV with extra whitespace', () => {
    const csvContent = '  John Doe  ,  john@example.com  \n  Jane Smith  ,  jane@example.com  '
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ])
  })

  it('handles CSV with missing email', () => {
    const csvContent = 'John Doe,john@example.com\nJane Smith\nBob Wilson,bob@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Bob Wilson', email: 'bob@example.com' }
    ])
  })

  it('handles CSV with missing name', () => {
    const csvContent = 'John Doe,john@example.com\n,jane@example.com\nBob Wilson,bob@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Bob Wilson', email: 'bob@example.com' }
    ])
  })

  it('handles CSV with empty name and email', () => {
    const csvContent = 'John Doe,john@example.com\n,\nBob Wilson,bob@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Bob Wilson', email: 'bob@example.com' }
    ])
  })

  it('handles CSV with special characters in names', () => {
    const csvContent = 'José María,jose@example.com\nFrançois,francois@example.com\n李小明,li@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'José María', email: 'jose@example.com' },
      { name: 'François', email: 'francois@example.com' },
      { name: '李小明', email: 'li@example.com' }
    ])
  })

  it('handles CSV with commas in names', () => {
    const csvContent = '"Smith, John",john.smith@example.com\nJane Doe,jane@example.com'
    const result = parseCSV(csvContent)
    
    // Note: This simple parser doesn't handle quoted fields with commas
    // It would split on the comma inside quotes
    expect(result).toEqual([
      { name: '"Smith', email: ' John"', john: 'smith@example.com' },
      { name: 'Jane Doe', email: 'jane@example.com' }
    ])
  })

  it('handles CSV with multiple commas', () => {
    const csvContent = 'John,Doe,john.doe@example.com\nJane,Smith,jane.smith@example.com'
    const result = parseCSV(csvContent)
    
    // Only takes first two parts
    expect(result).toEqual([
      { name: 'John', email: 'Doe' },
      { name: 'Jane', email: 'Smith' }
    ])
  })

  it('handles large CSV files', () => {
    const participants = Array.from({ length: 1000 }, (_, i) => 
      `Participant ${i + 1},participant${i + 1}@example.com`
    )
    const csvContent = participants.join('\n')
    
    const result = parseCSV(csvContent)
    
    expect(result).toHaveLength(1000)
    expect(result[0]).toEqual({ name: 'Participant 1', email: 'participant1@example.com' })
    expect(result[999]).toEqual({ name: 'Participant 1000', email: 'participant1000@example.com' })
  })

  it('handles CSV with Windows line endings', () => {
    const csvContent = 'John Doe,john@example.com\r\nJane Smith,jane@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ])
  })

  it('handles CSV with mixed line endings', () => {
    const csvContent = 'John Doe,john@example.com\nJane Smith,jane@example.com\r\nBob Wilson,bob@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Wilson', email: 'bob@example.com' }
    ])
  })

  it('handles CSV with trailing comma', () => {
    const csvContent = 'John Doe,john@example.com,\nJane Smith,jane@example.com,'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ])
  })

  it('handles CSV with leading comma', () => {
    const csvContent = ',john@example.com\n,jane@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([])
  })

  it('handles CSV with only commas', () => {
    const csvContent = ',\n,'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([])
  })

  it('handles CSV with very long lines', () => {
    const longName = 'A'.repeat(1000)
    const longEmail = 'a'.repeat(1000) + '@example.com'
    const csvContent = `${longName},${longEmail}`
    
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: longName, email: longEmail }
    ])
  })

  it('handles CSV with Unicode characters', () => {
    const csvContent = 'José María,josé.maría@example.com\nFrançois,françois@example.com\nАлександр,александр@example.com'
    const result = parseCSV(csvContent)
    
    expect(result).toEqual([
      { name: 'José María', email: 'josé.maría@example.com' },
      { name: 'François', email: 'françois@example.com' },
      { name: 'Александр', email: 'александр@example.com' }
    ])
  })

  it('handles CSV with tabs instead of commas', () => {
    const csvContent = 'John Doe\tjohn@example.com\nJane Smith\tjane@example.com'
    const result = parseCSV(csvContent)
    
    // Should not parse correctly since we're splitting on commas
    expect(result).toEqual([
      { name: 'John Doe\tjohn@example.com', email: undefined },
      { name: 'Jane Smith\tjane@example.com', email: undefined }
    ])
  })

  it('handles CSV with semicolons instead of commas', () => {
    const csvContent = 'John Doe;john@example.com\nJane Smith;jane@example.com'
    const result = parseCSV(csvContent)
    
    // Should not parse correctly since we're splitting on commas
    expect(result).toEqual([
      { name: 'John Doe;john@example.com', email: undefined },
      { name: 'Jane Smith;jane@example.com', email: undefined }
    ])
  })
})
