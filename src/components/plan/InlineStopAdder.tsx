
import React, { useState } from 'react';
import { MapPin, Clock, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface InlineStopAdderProps {
  onAdd: (stop: { name: string; address?: string; time?: string }) => void;
  onCancel: () => void;
}

const InlineStopAdder = ({ onAdd, onCancel }: InlineStopAdderProps) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        address: address.trim() || undefined,
        time: time.trim() || undefined
      });
    }
  };

  const quickSuggestions = [
    { name: "Coffee Break", icon: "☕" },
    { name: "Dinner Stop", icon: "🍽️" },
    { name: "Cocktail Bar", icon: "🍸" },
    { name: "Photo Spot", icon: "📸" }
  ];

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-primary font-medium mb-2">
            <MapPin size={14} />
            <span>Add New Stop</span>
          </div>

          <Input
            placeholder="Stop name (e.g., Blue Moon Bar)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-sm"
            autoFocus
          />

          <Input
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="text-sm"
          />

          <div className="flex items-center space-x-2">
            <Clock size={14} className="text-muted-foreground" />
            <Input
              placeholder="Time (e.g., 10:30 PM - 11:45 PM)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-sm flex-1"
            />
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion.name}
                type="button"
                onClick={() => setName(suggestion.name)}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-secondary/50 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{suggestion.icon}</span>
                <span>{suggestion.name}</span>
              </button>
            ))}
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              type="submit"
              size="sm"
              disabled={!name.trim()}
              className="h-7 text-xs"
            >
              <Check size={12} className="mr-1" />
              Add Stop
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="h-7 text-xs"
            >
              <X size={12} className="mr-1" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InlineStopAdder;
