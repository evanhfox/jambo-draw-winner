import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Participant {
  name: string;
  email: string;
}

interface DrawResult {
  winners: Participant[];
  timestamp: string;
  totalParticipants: number;
  drawId: string;
}

interface WinnersDisplayProps {
  result: DrawResult;
}

export const WinnersDisplay = ({ result }: WinnersDisplayProps) => {
  const downloadReport = () => {
    const report = {
      drawId: result.drawId,
      timestamp: result.timestamp,
      totalParticipants: result.totalParticipants,
      winnersCount: result.winners.length,
      winners: result.winners,
      auditInfo: {
        randomizationMethod: 'Cryptographically secure (crypto.getRandomValues)',
        algorithm: 'Fisher-Yates shuffle with crypto random values',
        securityLevel: 'Cryptographic (suitable for security-sensitive applications)',
        entropySource: 'OS-level entropy sources (hardware RNG, system noise)',
        drawDate: new Date(result.timestamp).toLocaleString(),
        technicalDetails: {
          randomNumberGenerator: 'Web Crypto API crypto.getRandomValues()',
          shuffleAlgorithm: 'Fisher-Yates (Durstenfeld variant)',
          timeComplexity: 'O(n)',
          biasLevel: 'Mathematically proven unbiased',
          selectionMethod: 'First N elements from shuffled array'
        }
      }
    };

    // Generate readable text report
    const textContent = [
      '═══════════════════════════════════════════════════════',
      '          CONTEST DRAW AUDIT REPORT',
      '═══════════════════════════════════════════════════════',
      '',
      `Draw ID: ${result.drawId}`,
      `Draw Date: ${new Date(result.timestamp).toLocaleString()}`,
      `Total Participants: ${result.totalParticipants}`,
      `Winners Selected: ${result.winners.length}`,
      '',
      '───────────────────────────────────────────────────────',
      'RANDOMIZATION METHOD & TECHNICAL DETAILS',
      '───────────────────────────────────────────────────────',
      'Random Number Generator: Web Crypto API crypto.getRandomValues()',
      'Algorithm: Fisher-Yates shuffle (Durstenfeld variant)',
      'Security Level: Cryptographic (suitable for security-sensitive applications)',
      'Entropy Source: OS-level entropy sources (hardware RNG, system noise)',
      'Time Complexity: O(n) - linear time',
      'Bias Level: Mathematically proven unbiased',
      'Selection Method: First N elements from shuffled array',
      '',
      'TECHNICAL IMPLEMENTATION:',
      '1. Generate cryptographically secure random values for each participant',
      '2. Apply Fisher-Yates shuffle using these random values',
      '3. Select first N participants from the shuffled array (configurable)',
      '',
      'SECURITY NOTES:',
      '- Uses browser-native Web Crypto API for random number generation',
      '- Random values are generated using OS-level entropy sources',
      '- Algorithm is mathematically proven to be unbiased',
      '- Suitable for security-sensitive applications and contests',
      '',
      '───────────────────────────────────────────────────────',
      'WINNERS',
      '───────────────────────────────────────────────────────',
      '',
      ...result.winners.map((w, idx) => 
        `${(idx + 1).toString().padStart(2, ' ')}. ${w.name}\n    Email: ${w.email}\n`
      ),
      '───────────────────────────────────────────────────────',
      '',
      'This report certifies that the above winners were selected',
      'using a cryptographically secure random number generator,',
      'ensuring a fair and unbiased draw process.',
      '',
      `Report generated: ${new Date().toLocaleString()}`,
      '═══════════════════════════════════════════════════════',
    ].join('\n');

    const textBlob = new Blob([textContent], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    const textLink = document.createElement('a');
    textLink.href = textUrl;
    textLink.download = `contest-draw-report-${result.drawId}.txt`;
    textLink.click();
    URL.revokeObjectURL(textUrl);

    // Also generate JSON for technical audit
    const jsonBlob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `contest-draw-data-${result.drawId}.json`;
    jsonLink.click();
    URL.revokeObjectURL(jsonUrl);
  };

  return (
    <Card className="border-accent/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent" />
          <CardTitle className="text-2xl">Winners Selected!</CardTitle>
        </div>
        <CardDescription>
          {result.winners.length} winners drawn from {result.totalParticipants} participants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {result.winners.map((winner, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{winner.name}</div>
                  <div className="text-sm text-muted-foreground">{winner.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Draw ID:</strong> {result.drawId}</p>
            <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            <p><strong>Method:</strong> Cryptographically secure random selection</p>
          </div>
          
          <Button 
            onClick={downloadReport} 
            variant="success"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Audit Report (TXT + JSON)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
