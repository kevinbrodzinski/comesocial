
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  duration?: number;
}

export const useUndoToast = () => {
  const { toast } = useToast();

  const showUndoToast = ({ message, onUndo, duration = 4000 }: UndoToastProps) => {
    toast({
      title: message,
      action: (
        <Button variant="outline" size="sm" onClick={onUndo}>
          Undo
        </Button>
      ),
      duration
    });
  };

  return { showUndoToast };
};
