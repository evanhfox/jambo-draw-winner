import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ParticipantsList } from '@/components/ParticipantsList';
import { WinnersDisplay } from '@/components/WinnersDisplay';
import { RandomnessVisualization } from '@/components/RandomnessVisualization';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, RotateCcw, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

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

const Index = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const handleFileUpload = (uploadedParticipants: Participant[]) => {
    setParticipants(uploadedParticipants);
    setDrawResult(null);
    toast.success(`Loaded ${uploadedParticipants.length} participants`);
  };

  const performDraw = async () => {
    if (participants.length < 7) {
      toast.error('Need at least 7 participants to draw 7 winners');
      return;
    }

    setIsDrawing(true);

    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Cryptographically secure random selection
    const shuffled = [...participants];
    const array = new Uint32Array(shuffled.length);
    crypto.getRandomValues(array);
    
    // Fisher-Yates shuffle with crypto random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = array[i] % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const winners = shuffled.slice(0, 7);
    const drawId = crypto.randomUUID().slice(0, 8);
    
    const result: DrawResult = {
      winners,
      timestamp: new Date().toISOString(),
      totalParticipants: participants.length,
      drawId
    };

    setDrawResult(result);
    setIsDrawing(false);

    // Confetti celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);

    toast.success('Winners drawn successfully!');
  };

  const reset = () => {
    setParticipants([]);
    setDrawResult(null);
    toast.info('Ready for a new draw');
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      'Sarah Johnson,sarah.johnson@email.com',
      'Michael Chen,michael.chen@email.com',
      'Emma Rodriguez,emma.rodriguez@email.com',
      'James Wilson,james.wilson@email.com',
      'Olivia Martinez,olivia.martinez@email.com',
      'David Kim,david.kim@email.com',
      'Sophia Anderson,sophia.anderson@email.com',
      'Daniel Brown,daniel.brown@email.com',
      'Ava Thompson,ava.thompson@email.com',
      'Matthew Davis,matthew.davis@email.com',
      'Isabella Garcia,isabella.garcia@email.com',
      'Christopher Lee,christopher.lee@email.com',
      'Mia White,mia.white@email.com',
      'Joshua Taylor,joshua.taylor@email.com',
      'Charlotte Moore,charlotte.moore@email.com',
      'Andrew Jackson,andrew.jackson@email.com',
      'Amelia Harris,amelia.harris@email.com',
      'Ryan Martinez,ryan.martinez@email.com',
      'Harper Clark,harper.clark@email.com',
      'Ethan Lewis,ethan.lewis@email.com'
    ].join('\n');

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-participants.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sample CSV downloaded!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-[hsl(280_70%_60%)] bg-clip-text text-transparent">
            Contest Draw Platform
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Secure, auditable, and truly random winner selection
          </p>
          <Button onClick={downloadSampleCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download Sample CSV
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {!participants.length ? (
              <FileUpload onFileUpload={handleFileUpload} />
            ) : (
              <>
                <ParticipantsList participants={participants} />
                <div className="flex gap-3">
                  <Button
                    onClick={performDraw}
                    disabled={isDrawing || drawResult !== null}
                    variant="gradient"
                    className="flex-1 h-14 text-lg"
                  >
                    {isDrawing ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Drawing Winners...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Draw 7 Winners
                      </>
                    )}
                  </Button>
                  <Button onClick={reset} variant="outline" className="h-14">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>
                <RandomnessVisualization participantCount={participants.length} />
              </>
            )}
          </div>

          <div>
            {drawResult && <WinnersDisplay result={drawResult} />}
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-4 text-lg">🔒 How Our Randomness Works</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-primary">Cryptographic Security</h4>
                  <p className="text-sm text-muted-foreground">
                    We use the browser's native <code className="bg-secondary px-1 rounded">crypto.getRandomValues()</code> API, 
                    which generates cryptographically secure random numbers suitable for security-sensitive applications.
                  </p>
                  <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                    <strong>Technical:</strong> Uses OS-level entropy sources (hardware random number generators, system noise, etc.)
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-primary">Fisher-Yates Shuffle</h4>
                  <p className="text-sm text-muted-foreground">
                    Our algorithm shuffles the entire participant list using the Fisher-Yates method, 
                    ensuring each participant has an equal probability of being selected.
                  </p>
                  <div className="text-xs text-muted-foreground bg-secondary/50 p-2 rounded">
                    <strong>Algorithm:</strong> O(n) time complexity, mathematically proven unbiased
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-primary mb-2">Step-by-Step Process</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="font-medium">1. Generate Random Values</div>
                    <div className="text-muted-foreground text-xs">Create cryptographically secure random numbers for each participant</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">2. Shuffle Participants</div>
                    <div className="text-muted-foreground text-xs">Apply Fisher-Yates shuffle using the random values</div>
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium">3. Select Winners</div>
                    <div className="text-muted-foreground text-xs">Take the first 7 participants from the shuffled list</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">About This Draw System</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Uses cryptographically secure randomization (crypto.getRandomValues)</li>
              <li>✓ Implements Fisher-Yates shuffle algorithm for unbiased selection</li>
              <li>✓ Generates unique draw ID for each contest</li>
              <li>✓ Provides downloadable audit reports (TXT + JSON)</li>
              <li>✓ Timestamps and tracks all draw metadata</li>
              <li>✓ Open source and auditable code</li>
            </ul>
            
            <Collapsible open={showTechnicalDetails} onOpenChange={setShowTechnicalDetails}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="mt-4 p-0 h-auto font-normal text-sm text-muted-foreground hover:text-foreground">
                  {showTechnicalDetails ? (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Hide Technical Implementation Details
                    </>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4 mr-1" />
                      Show Technical Implementation Details
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Implementation Details</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-primary">Random Number Generation:</strong>
                      <div className="ml-4 mt-1 text-muted-foreground">
                        <code className="bg-secondary px-1 rounded">crypto.getRandomValues(new Uint32Array(length))</code>
                        <br />
                        Uses OS-level entropy sources including hardware random number generators, system noise, and other unpredictable sources.
                      </div>
                    </div>
                    
                    <div>
                      <strong className="text-primary">Shuffle Algorithm:</strong>
                      <div className="ml-4 mt-1 text-muted-foreground">
                        <pre className="bg-secondary p-2 rounded text-xs overflow-x-auto">
{`for (let i = shuffled.length - 1; i > 0; i--) {
  const j = array[i] % (i + 1);
  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}`}
                        </pre>
                        Fisher-Yates (Durstenfeld) shuffle with cryptographically secure random values.
                      </div>
                    </div>
                    
                    <div>
                      <strong className="text-primary">Security Properties:</strong>
                      <div className="ml-4 mt-1 text-muted-foreground">
                        • <strong>Unpredictable:</strong> Cannot be predicted or manipulated<br />
                        • <strong>Unbiased:</strong> Each participant has equal probability<br />
                        • <strong>Cryptographic:</strong> Suitable for security-sensitive applications<br />
                        • <strong>Auditable:</strong> Complete audit trail with timestamps and IDs
                      </div>
                    </div>
                    
                    <div>
                      <strong className="text-primary">Browser Compatibility:</strong>
                      <div className="ml-4 mt-1 text-muted-foreground">
                        Web Crypto API is supported in all modern browsers (Chrome 11+, Firefox 21+, Safari 7+, Edge 12+)
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
