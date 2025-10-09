import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FileUploadProps {
  onFileUpload: (participants: Array<{ name: string; email: string }>) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const participants: Array<{ name: string; email: string }> = [];
    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      const emailMatch = trimmedLine.match(emailPattern);
      if (!emailMatch) continue;
      
      const email = emailMatch[0];
      const name = email.split('@')[0]
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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
