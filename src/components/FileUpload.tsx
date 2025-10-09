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
    
    // Skip header rows (lines that don't contain valid email addresses)
    let dataStarted = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Split by comma, but be mindful of quoted fields
      const parts = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      
      // Look for email pattern in the line
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let email = '';
      let timestamp = '';
      
      // Find the email in the parts
      for (let j = 0; j < parts.length; j++) {
        if (emailPattern.test(parts[j])) {
          email = parts[j];
          // If there's a timestamp before the email (first column), capture it
          if (j > 0 && /^\d{4}-\d{2}-\d{2}/.test(parts[0])) {
            timestamp = parts[0];
          }
          break;
        }
      }
      
      // Skip header rows or lines without valid emails
      if (!email) continue;
      
      dataStarted = true;
      
      // Extract name from email (before the @)
      const name = email.split('@')[0]
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      participants.push({ name, email });
    }
    
    return participants;
  };

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const participants = parseCSV(text);
      onFileUpload(participants);
    };
    reader.readAsText(file);
  }, [onFileUpload]);

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
            Supports multiple formats: name,email or Google Forms exports
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
