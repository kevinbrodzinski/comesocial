
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface PlanHeaderProps {
  planName: string;
  planDate: string;
  planTime: string;
  stopsCount: number;
  onClose: () => void;
}

const PlanHeader = ({ planName, planDate, planTime, stopsCount, onClose }: PlanHeaderProps) => {
  return (
    <div className="flex items-center gap-4 bg-card rounded-xl p-6 border light-card-shadow">
      <Button variant="outline" onClick={onClose} className="hover:scale-105 transition-transform border-border hover:border-primary">
        <ArrowLeft size={16} className="mr-2" />
        Back to Plans
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {planName}
        </h1>
        <p className="text-muted-foreground text-lg">{planDate} at {planTime}</p>
      </div>
      <Badge variant="secondary" className="text-lg px-4 py-2 bg-primary/10 text-primary border-primary/20">
        {stopsCount} stops
      </Badge>
    </div>
  );
};

export default PlanHeader;
