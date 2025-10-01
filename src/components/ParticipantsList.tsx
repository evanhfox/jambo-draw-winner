import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface Participant {
  name: string;
  email: string;
}

interface ParticipantsListProps {
  participants: Participant[];
}

export const ParticipantsList = ({ participants }: ParticipantsListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <CardTitle>Participants</CardTitle>
        </div>
        <CardDescription>{participants.length} total entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {participants.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-muted-foreground">{p.email}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
