
import React from 'react';
import { Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyBlastsStateProps {
  onCreateBlast: () => void;
}

const EmptyBlastsState = ({ onCreateBlast }: EmptyBlastsStateProps) => {
  return (
    <div className="text-center py-16 px-6">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <Users size={32} className="text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No one's asking "Who's Down?" yet
        </h3>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
          Be the first to spark some spontaneous plans! Ask your friends who's down to go out tonight.
        </p>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={onCreateBlast}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          <Zap size={16} className="mr-2" />
          Start a Blast
        </Button>
        
        <div className="text-xs text-muted-foreground">
          Quick, casual, perfect for tonight's plans
        </div>
      </div>
    </div>
  );
};

export default EmptyBlastsState;
