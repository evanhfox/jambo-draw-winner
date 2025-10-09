import { describe, it, expect } from 'vitest'

// Extracted CSV parsing logic for testing
function parseCSV(text: string): Array<{ name: string; email: string }> {
  const lines = text.split('\n').filter(line => line.trim())
  const participants: Array<{ name: string; email: string }> = []
  
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
      if (name && email) {
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
      { name: '"Smith', email: 'John"' },
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
    expect(result).toEqual([])
  })

  it('handles CSV with semicolons instead of commas', () => {
    const csvContent = 'John Doe;john@example.com\nJane Smith;jane@example.com'
    const result = parseCSV(csvContent)
    
    // Should not parse correctly since we're splitting on commas
    expect(result).toEqual([])
  })

  describe('Google Forms CSV parsing', () => {
    it('parses Google Forms CSV with headers correctly', () => {
      const csvContent = `Timestamp,Email Address,"Key Requirements and Logistics for Jamboard Pickup
Please read the following requirements carefully before expressing interest:
Pickup Deadline
All Jamboards must be picked up and removed from the Ottawa Office by the end of day on October 10th, 2025. After this date, these devices will be scheduled for electronic disposal.
Transportation Responsibility
The recipient is solely responsible for all moving and transport logistics. Due to the Jamboard's size and weight, you will need:
- A suitable vehicle (e.g., truck, large SUV, or van). It will not fit in a standard car.
- Two people are suggested to move it safely.
Dimensions & Weight
These are large and heavy commercial displays.
Approximate Dimensions: 53.2″ (W) x 32.4″ (H) x 3.5″ (D)
Approximate Weight: 90 lbs (display only), plus the weight of the rolling stand if included.
Support: No support is available from Google or Payments Canada. Devices are factory reset and contain no corporate data or configurations."
2025-09-24 14:35:05,lbooth@payments.ca,"I understand and agree to the requirements and logistics. Please submit my name for consideration., I confirm I am interested even if the device does not include the stand (i.e wall mount only)"
2025-09-24 14:36:44,abelangour@payments.ca,"I understand and agree to the requirements and logistics. Please submit my name for consideration., I confirm I am interested even if the device does not include the stand (i.e wall mount only)"`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'Lbooth', email: 'lbooth@payments.ca' },
        { name: 'Abelangour', email: 'abelangour@payments.ca' }
      ])
    })

    it('handles Google Forms CSV with quoted fields containing commas', () => {
      const csvContent = `Timestamp,Email Address,Response
2025-09-24 14:35:05,john.doe@example.com,"I understand, and agree to the requirements, and logistics."
2025-09-24 14:36:44,jane.smith@example.com,"I confirm I am interested, even if the device does not include the stand."`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' }
      ])
    })

    it('handles Google Forms CSV with escaped quotes', () => {
      const csvContent = `Timestamp,Email Address,Response
2025-09-24 14:35:05,john.doe@example.com,"I understand ""and agree"" to the requirements."
2025-09-24 14:36:44,jane.smith@example.com,"I confirm I am interested."`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' }
      ])
    })

    it('handles Google Forms CSV with invalid email addresses', () => {
      const csvContent = `Timestamp,Email Address,Response
2025-09-24 14:35:05,invalid-email,"I understand and agree to the requirements."
2025-09-24 14:36:44,jane.smith@example.com,"I confirm I am interested."`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'Jane Smith', email: 'jane.smith@example.com' }
      ])
    })

    it('handles Google Forms CSV with empty email field', () => {
      const csvContent = `Timestamp,Email Address,Response
2025-09-24 14:35:05,,"I understand and agree to the requirements."
2025-09-24 14:36:44,jane.smith@example.com,"I confirm I am interested."`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'Jane Smith', email: 'jane.smith@example.com' }
      ])
    })

    it('handles Google Forms CSV with different header variations', () => {
      const csvContent = `Timestamp,Email,Response
2025-09-24 14:35:05,john.doe@example.com,"I understand and agree to the requirements."
2025-09-24 14:36:44,jane.smith@example.com,"I confirm I am interested."`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' }
      ])
    })

    it('handles Google Forms CSV with only headers', () => {
      const csvContent = `Timestamp,Email Address,"Key Requirements and Logistics for Jamboard Pickup"`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([])
    })

    it('handles Google Forms CSV with mixed valid and invalid entries', () => {
      const csvContent = `Timestamp,Email Address,Response
2025-09-24 14:35:05,john.doe@example.com,"I understand and agree to the requirements."
2025-09-24 14:36:44,invalid-email,"I confirm I am interested."
2025-09-24 14:37:00,jane.smith@example.com,"I confirm I am interested."
2025-09-24 14:38:00,,"I understand and agree to the requirements."`
      
      const result = parseCSV(csvContent)
      
      expect(result).toEqual([
        { name: 'John Doe', email: 'john.doe@example.com' },
        { name: 'Jane Smith', email: 'jane.smith@example.com' }
      ])
    })
  })
})
