
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import RSVPSwitch from './RSVPSwitch';
import { Plan } from '@/data/plansData';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
  currentRsvp?: 'going' | 'maybe' | 'cant_go' | null;
  onRsvpChange: (status: 'going' | 'maybe' | 'cant_go') => void;
  onViewPlan: () => void;
}

const RSVPModal = ({ 
  isOpen, 
  onClose, 
  plan, 
  currentRsvp, 
  onRsvpChange,
  onViewPlan 
}: RSVPModalProps) => {
  const handleViewPlan = () => {
    onClose();
    onViewPlan();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>You're Invited!</DialogTitle>
          <DialogDescription>
            {plan.organizer} invited you to join their plan
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Plan Preview */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                Invited
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock size={12} className="mr-2" />
                <span>{plan.date} at {plan.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={12} className="mr-2" />
                <span>{plan.stops?.[0]?.name || 'Multiple stops'}</span>
              </div>
              <div className="flex items-center">
                <Users size={12} className="mr-2" />
                <span>{plan.attendees} attending</span>
              </div>
            </div>
            
            {plan.description && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {plan.description}
              </p>
            )}
          </div>
          
          {/* RSVP Section */}
          <div>
            <h4 className="font-medium mb-3">Will you be joining?</h4>
            <RSVPSwitch
              planId={plan.id}
              currentRsvp={currentRsvp}
              onRsvpChange={onRsvpChange}
              layout="stack"
              size="default"
            />
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={handleViewPlan} className="flex-1">
              View Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RSVPModal;
