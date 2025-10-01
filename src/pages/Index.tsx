import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ParticipantsList } from '@/components/ParticipantsList';
import { WinnersDisplay } from '@/components/WinnersDisplay';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-[hsl(280_70%_60%)] bg-clip-text text-transparent">
            Contest Draw Platform
          </h1>
          <p className="text-lg text-muted-foreground">
            Secure, auditable, and truly random winner selection
          </p>
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
              </>
            )}
          </div>

          <div>
            {drawResult && <WinnersDisplay result={drawResult} />}
          </div>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-card border">
          <h3 className="font-semibold mb-2">About This Draw System</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Uses cryptographically secure randomization (crypto.getRandomValues)</li>
            <li>✓ Implements Fisher-Yates shuffle algorithm for unbiased selection</li>
            <li>✓ Generates unique draw ID for each contest</li>
            <li>✓ Provides downloadable audit reports (CSV + JSON)</li>
            <li>✓ Timestamps and tracks all draw metadata</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
