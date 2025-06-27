
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw, Map } from 'lucide-react';

interface StaticErrorStateProps {
  onRetry: () => void;
  errorMessage?: string;
}

const StaticErrorState = ({ onRetry, errorMessage }: StaticErrorStateProps) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg m-4">
      <div className="text-center max-w-md p-8">
        <div className="relative mb-6">
          <Map className="w-16 h-16 text-slate-300 mx-auto" />
          <AlertCircle className="w-6 h-6 text-red-500 absolute -top-1 -right-1" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Map Failed to Load
        </h3>
        
        <p className="text-sm text-slate-500 mb-4">
          {errorMessage || 'There was a problem loading the interactive map. You can still browse venues and view friend activity below.'}
        </p>
        
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 text-sm">
            <Map className="w-4 h-4" />
            <span className="font-medium">Alternative:</span>
          </div>
          <p className="text-blue-600 text-xs mt-1">
            Browse venues using the list view or search for specific locations
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaticErrorState;
