
import React from 'react';
import { Label } from '@/components/ui/label';

interface TimeSlotSelectorProps {
  timeSlot: string;
  onTimeSlotChange: (timeSlot: string) => void;
}

const TimeSlotSelector = ({ timeSlot, onTimeSlotChange }: TimeSlotSelectorProps) => {
  const timeSlotOptions = [
    'Right now',
    'In 30 mins',
    'In 1 hour',
    'Tonight at 8pm',
    'Tonight at 9pm',
    'Tonight at 10pm',
    'Later tonight'
  ];

  return (
    <div>
      <Label htmlFor="time-slot">When?</Label>
      <select
        id="time-slot"
        value={timeSlot}
        onChange={(e) => onTimeSlotChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-sm"
      >
        <option value="">Select time...</option>
        {timeSlotOptions.map(slot => (
          <option key={slot} value={slot}>{slot}</option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotSelector;
