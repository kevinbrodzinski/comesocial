
import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PlanDetailsStepProps {
  planData: any;
  onInputChange: (field: string, value: any) => void;
  onShowMapPicker: () => void;
  dateValidation: { isValid: boolean; message: string };
}

const PlanDetailsStep = ({ 
  planData, 
  onInputChange, 
  onShowMapPicker, 
  dateValidation 
}: PlanDetailsStepProps) => {
  return (
    <div className="space-y-6 animate-slide-in-right">
      {/* Plan Name Section */}
      <div>
        <Label htmlFor="name" className="text-foreground font-medium">Plan Name</Label>
        <Input
          id="name"
          placeholder="Epic Friday Night Out"
          value={planData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className="mt-2"
        />
      </div>

      <div className="border-t border-border"></div>

      {/* Date & Time Section */}
      <div className="bg-card rounded-xl p-4 ring-1 ring-border light-card-shadow">
        <h3 className="text-sm text-muted-foreground font-medium mb-3 uppercase tracking-wide">Event Time</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-foreground">Date</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                value={planData.date}
                onChange={(e) => onInputChange('date', e.target.value)}
              />
            </div>
            {!dateValidation.isValid && (
              <p className="text-sm text-destructive mt-1">{dateValidation.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="time" className="text-foreground">Time</Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                className="pl-10"
                value={planData.time}
                onChange={(e) => onInputChange('time', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-card rounded-xl p-4 ring-1 ring-border light-card-shadow">
        <h3 className="text-sm text-muted-foreground font-medium mb-3 uppercase tracking-wide">Location</h3>
        <div>
          <Label htmlFor="meetupLocation" className="text-foreground">Meetup Location</Label>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="meetupLocation"
                placeholder="Where should everyone meet?"
                className="pl-10"
                value={planData.meetupLocation}
                onChange={(e) => onInputChange('meetupLocation', e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={onShowMapPicker}
            >
              <MapPin size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-border"></div>

      {/* Notes Section */}
      <div>
        <Label htmlFor="notes" className="text-foreground font-medium">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any special instructions or details..."
          value={planData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          rows={3}
          className="mt-2 resize-none"
        />
      </div>
    </div>
  );
};

export default PlanDetailsStep;
