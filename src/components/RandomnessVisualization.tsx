import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shuffle, Zap, CheckCircle } from 'lucide-react';

interface RandomnessVisualizationProps {
  participantCount: number;
  winnerCount: number;
}

export const RandomnessVisualization = ({ participantCount, winnerCount }: RandomnessVisualizationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  const steps = [
    {
      title: "Generate Random Values",
      description: "Create cryptographically secure random numbers",
      icon: <Zap className="w-5 h-5" />,
      color: "text-blue-500"
    },
    {
      title: "Apply Fisher-Yates Shuffle",
      description: "Shuffle participants using random values",
      icon: <Shuffle className="w-5 h-5" />,
      color: "text-purple-500"
    },
    {
      title: "Select Winners",
      description: `Take first ${winnerCount} from shuffled list`,
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-500"
    }
  ];

  const animateProcess = async () => {
    setIsAnimating(true);
    setCurrentStep(0);
    
    // Generate some example shuffled indices for visualization
    const indices = Array.from({ length: Math.min(participantCount, 20) }, (_, i) => i);
    const shuffled = [...indices];
    
    // Simulate Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setShuffledIndices(shuffled);
    
    // Animate through steps
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setIsAnimating(false);
  };

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-accent" />
          Randomness Process Visualization
        </CardTitle>
        <CardDescription>
          See how our cryptographically secure randomization works
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                currentStep === index
                  ? 'bg-accent/10 border border-accent/30 scale-105'
                  : currentStep > index
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-secondary/50'
              }`}
            >
              <div className={`${step.color} ${currentStep >= index ? 'opacity-100' : 'opacity-50'}`}>
                {currentStep > index ? <CheckCircle className="w-5 h-5" /> : step.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{step.title}</div>
                <div className="text-sm text-muted-foreground">{step.description}</div>
              </div>
              {currentStep === index && (
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {shuffledIndices.length > 0 && (
          <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
            <h4 className="font-medium mb-2">Example Shuffle Result:</h4>
            <div className="flex flex-wrap gap-1">
              {shuffledIndices.slice(0, 10).map((idx, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 rounded text-xs font-mono ${
                    i < winnerCount ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
              {shuffledIndices.length > 10 && (
                <div className="px-2 py-1 rounded text-xs bg-secondary">
                  +{shuffledIndices.length - 10} more
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              First {winnerCount} position{winnerCount === 1 ? '' : 's'} (highlighted) would be selected as winner{winnerCount === 1 ? '' : 's'}
            </div>
          </div>
        )}

        <Button
          onClick={animateProcess}
          disabled={isAnimating || participantCount === 0}
          variant="outline"
          className="w-full"
        >
          {isAnimating ? (
            <>
              <Shuffle className="w-4 h-4 mr-2 animate-spin" />
              Demonstrating Process...
            </>
          ) : (
            <>
              <Shuffle className="w-4 h-4 mr-2" />
              Demonstrate Randomization Process
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Note:</strong> This is a simplified demonstration. The actual process uses:</p>
          <ul className="ml-4 space-y-1">
            <li>• Cryptographically secure random values (crypto.getRandomValues)</li>
            <li>• OS-level entropy sources for true randomness</li>
            <li>• Mathematically proven unbiased Fisher-Yates algorithm</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
