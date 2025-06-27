
import React from 'react';
import { Input } from '@/components/ui/input';

interface VibeCustomTextInputProps {
  customText: string;
  onCustomTextChange: (text: string) => void;
  isVisible: boolean;
}

const VibeCustomTextInput = ({ customText, onCustomTextChange, isVisible }: VibeCustomTextInputProps) => {
  if (!isVisible) return null;

  return (
    <div className="mb-4">
      <Input
        placeholder="Add a note (optional)"
        value={customText}
        onChange={(e) => onCustomTextChange(e.target.value)}
        maxLength={50}
        className="text-sm"
      />
      <p className="text-xs text-muted-foreground mt-1">
        {customText.length}/50 characters
      </p>
    </div>
  );
};

export default VibeCustomTextInput;
