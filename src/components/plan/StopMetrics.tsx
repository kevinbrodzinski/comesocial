
import React from 'react';
import { Clock, MapPin, DollarSign } from 'lucide-react';

interface StopMetricsProps {
  estimatedTime?: number;
  cost?: number;
}

const StopMetrics = ({ estimatedTime = 90, cost = 25 }: StopMetricsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
      <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <Clock size={12} className="text-blue-600" />
        </div>
        <span className="font-medium text-blue-700">{estimatedTime}m</span>
      </div>
      <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3 border border-green-100">
        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <DollarSign size={12} className="text-green-600" />
        </div>
        <span className="font-medium text-green-700">${cost}</span>
      </div>
      <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-3 border border-purple-100">
        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
          <MapPin size={12} className="text-purple-600" />
        </div>
        <span className="font-medium text-purple-700">0.2mi</span>
      </div>
    </div>
  );
};

export default StopMetrics;
