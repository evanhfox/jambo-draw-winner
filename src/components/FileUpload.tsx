import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload: (participants: Array<{ name: string; email: string }>) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const participants: Array<{ name: string; email: string }> = [];
    
    // Check if this looks like a Google Forms CSV (has headers)
    const firstLine = lines[0]?.trim();
    const isGoogleForms = firstLine && (
      firstLine.includes('Timestamp') || 
      firstLine.includes('Email Address') ||
      firstLine.includes('Email')
    );
    
    if (isGoogleForms) {
      // Parse Google Forms CSV format
      for (let i = 1; i < lines.length; i++) { // Skip header row
        const line = lines[i].trim();
        if (!line) continue;
        
        // Parse CSV line properly handling quoted fields
        const fields = parseCSVLine(line);
        if (fields.length >= 2) {
          const timestamp = fields[0];
          const email = fields[1];
          
          if (email && isValidEmail(email)) {
            // Extract name from email (everything before @)
            const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            participants.push({ name, email });
          }
        }
      }
    } else {
      // Parse simple CSV format (name,email)
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [name, email] = line.split(',').map(s => s.trim());
        if (name && email) {
          participants.push({ name, email });
        }
      }
    }
    
    return participants;
  };

  // Helper function to parse CSV line with proper quote handling
  const parseCSVLine = (line: string): string[] => {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < line.length) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        fields.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    // Add the last field
    fields.push(current.trim());
    
    return fields;
  };

  // Helper function to validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const participants = parseCSV(text);
      onFileUpload(participants);
    };
    reader.readAsText(file);
  }, [onFileUpload, parseCSV]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <Card
      className="border-2 border-dashed border-border hover:border-primary transition-colors cursor-pointer p-12 text-center"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Upload Participant List</h3>
          <p className="text-muted-foreground text-sm">
            Drop your CSV file here or click to browse
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Supports: Simple CSV (name,email) or Google Forms exports
          </p>
        </div>
        <input
          id="file-input"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    </Card>
  );
};
