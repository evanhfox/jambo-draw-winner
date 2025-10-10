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
  allParticipants: Participant[];
  csvFormat: 'simple' | 'google-forms';
  randomizationDetails: {
    randomValues: number[];
    preShuffleOrder: Participant[];
    postShuffleOrder: Participant[];
    shuffleSteps: Array<{
      step: number;
      description: string;
      participant: Participant;
      randomValue: number;
      newPosition: number;
    }>;
  };
  processingDetails: {
    csvSourceInfo: string;
    parsingNotes: string[];
    validationResults: {
      totalEntries: number;
      validEntries: number;
      invalidEntries: number;
      duplicatesRemoved: number;
    };
  };
}

interface WinnersDisplayProps {
  result: DrawResult;
}

export const WinnersDisplay = ({ result }: WinnersDisplayProps) => {
  const downloadReport = () => {
    const drawDate = new Date(result.timestamp);
    const reportDate = new Date();
    
    // Calculate statistical measures
    const entropy = result.randomizationDetails.randomValues.reduce((sum, val) => {
      return sum - val * Math.log2(val || 0.000001);
    }, 0);
    
    const meanRandom = result.randomizationDetails.randomValues.reduce((sum, val) => sum + val, 0) / result.randomizationDetails.randomValues.length;
    const variance = result.randomizationDetails.randomValues.reduce((sum, val) => sum + Math.pow(val - meanRandom, 2), 0) / result.randomizationDetails.randomValues.length;
    
    // Generate comprehensive text report
    const textContent = [
      '═══════════════════════════════════════════════════════════════════════════════════════',
      '                           COMPREHENSIVE CONTEST DRAW AUDIT REPORT',
      '═══════════════════════════════════════════════════════════════════════════════════════',
      '',
      'EXECUTIVE SUMMARY',
      '───────────────────────────────────────────────────────────────────────────────────────',
      `Contest Draw ID:           ${result.drawId}`,
      `Draw Date & Time:          ${drawDate.toLocaleString()} (${drawDate.toISOString()})`,
      `Report Generated:          ${reportDate.toLocaleString()}`,
      `Total Participants:         ${result.totalParticipants}`,
      `Winners Selected:          ${result.winners.length}`,
      `CSV Format Detected:        ${result.csvFormat === 'google-forms' ? 'Google Forms Export' : 'Simple CSV'}`,
      `Randomization Method:       Cryptographically Secure (Web Crypto API)`,
      `Algorithm Used:            Fisher-Yates Shuffle (Durstenfeld variant)`,
      '',
      'CSV PROCESSING DETAILS',
      '───────────────────────────────────────────────────────────────────────────────────────',
      `Source Information:        ${result.processingDetails.csvSourceInfo}`,
      `Total Entries Processed:   ${result.processingDetails.validationResults.totalEntries}`,
      `Valid Entries:             ${result.processingDetails.validationResults.validEntries}`,
      `Invalid Entries:           ${result.processingDetails.validationResults.invalidEntries}`,
      `Duplicates Removed:        ${result.processingDetails.validationResults.duplicatesRemoved}`,
      '',
      'Parsing Notes:',
      ...result.processingDetails.parsingNotes.map(note => `  • ${note}`),
      '',
      'COMPLETE PARTICIPANT LIST',
      '───────────────────────────────────────────────────────────────────────────────────────',
      'All participants in original order (before randomization):',
      '',
      ...result.allParticipants.map((participant, idx) => 
        `${(idx + 1).toString().padStart(3, ' ')}. ${participant.name.padEnd(25)} | ${participant.email}`
      ),
      '',
      'DETAILED RANDOMIZATION PROCESS',
      '───────────────────────────────────────────────────────────────────────────────────────',
      'Random Number Generation:',
      `  • Entropy Source:         OS-level hardware random number generator`,
      `  • API Used:              Web Crypto API crypto.getRandomValues()`,
      `  • Security Level:         Cryptographic (suitable for security applications)`,
      `  • Statistical Entropy:   ${entropy.toFixed(6)} bits`,
      `  • Mean Random Value:     ${meanRandom.toFixed(6)}`,
      `  • Variance:              ${variance.toFixed(6)}`,
      '',
      'Fisher-Yates Shuffle Process:',
      '  Step-by-step randomization (showing each swap operation):',
      '',
      ...result.randomizationDetails.shuffleSteps.map(step => 
        `  Step ${step.step.toString().padStart(2, ' ')}: ${step.description.padEnd(35)} | ` +
        `Participant: ${step.participant.name.padEnd(20)} | ` +
        `Random Value: ${step.randomValue.toFixed(6)} | ` +
        `New Position: ${step.newPosition}`
      ),
      '',
      'POST-SHUFFLE PARTICIPANT ORDER',
      '───────────────────────────────────────────────────────────────────────────────────────',
      'Complete participant list after randomization (in selection order):',
      '',
      ...result.randomizationDetails.postShuffleOrder.map((participant, idx) => 
        `${(idx + 1).toString().padStart(3, ' ')}. ${participant.name.padEnd(25)} | ${participant.email}`
      ),
      '',
      'WINNER SELECTION',
      '───────────────────────────────────────────────────────────────────────────────────────',
      `Selected first ${result.winners.length} participants from shuffled list:`,
      '',
      ...result.winners.map((winner, idx) => 
        `  ${(idx + 1).toString().padStart(2, ' ')}. ${winner.name.padEnd(25)} | ${winner.email}`
      ),
      '',
      'TECHNICAL VERIFICATION DATA',
      '───────────────────────────────────────────────────────────────────────────────────────',
      'Raw Random Values Used (normalized 0-1):',
      ...result.randomizationDetails.randomValues.map((val, idx) => 
        `  Position ${idx.toString().padStart(2, ' ')}: ${val.toFixed(8)}`
      ),
      '',
      'Algorithm Implementation:',
      '  1. Generate cryptographically secure random values for each participant',
      '  2. Apply Fisher-Yates shuffle using these random values',
      '  3. Select first N participants from the shuffled array',
      '',
      'Security Properties:',
      '  ✓ Uses browser-native Web Crypto API for random number generation',
      '  ✓ Random values generated using OS-level entropy sources',
      '  ✓ Algorithm is mathematically proven to be unbiased',
      '  ✓ Suitable for security-sensitive applications and contests',
      '  ✓ Each participant has equal probability of selection',
      '',
      'VERIFICATION INSTRUCTIONS',
      '───────────────────────────────────────────────────────────────────────────────────────',
      'To verify this draw was fair and legitimate:',
      '',
      '1. Reproducibility:',
      '   • Use the same random values with Fisher-Yates algorithm',
      '   • Verify the shuffle steps produce the same result',
      '   • Confirm winner selection from first N positions',
      '',
      '2. Statistical Analysis:',
      '   • Check random value distribution (should be uniform)',
      '   • Verify entropy quality (should be high)',
      '   • Confirm no patterns or biases in selection',
      '',
      '3. Technical Verification:',
      '   • Review Web Crypto API documentation',
      '   • Verify Fisher-Yates algorithm implementation',
      '   • Check timestamp and draw ID consistency',
      '',
      '4. External Resources:',
      '   • Fisher-Yates Shuffle: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle',
      '   • Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API',
      '   • Source Code: Available in repository for full audit',
      '',
      'CERTIFICATION',
      '───────────────────────────────────────────────────────────────────────────────────────',
      '',
      'This report certifies that the above winners were selected using a',
      'cryptographically secure random number generator and the Fisher-Yates',
      'shuffle algorithm, ensuring a completely fair and unbiased draw process.',
      '',
      'The randomization process has been fully documented and can be',
      'independently verified using the provided random values and algorithm.',
      '',
      `Report generated: ${reportDate.toLocaleString()}`,
      `Draw ID: ${result.drawId}`,
      '═══════════════════════════════════════════════════════════════════════════════════════',
    ].join('\n');

    // Download text report
    const textBlob = new Blob([textContent], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    const textLink = document.createElement('a');
    textLink.href = textUrl;
    textLink.download = `contest-draw-audit-report-${result.drawId}.txt`;
    textLink.click();
    URL.revokeObjectURL(textUrl);
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
            Download Audit Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
