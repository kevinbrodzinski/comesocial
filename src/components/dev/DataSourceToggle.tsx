import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, FileText, Settings } from 'lucide-react';
import { useDataSourceToggle } from '@/hooks/useDataService';

interface DataSourceToggleProps {
  className?: string;
}

const DataSourceToggle: React.FC<DataSourceToggleProps> = ({ className }) => {
  const { isUsingMockData, toggleDataSource } = useDataSourceToggle();

  const getDataSourceIcon = () => {
    return isUsingMockData ? <FileText className="w-4 h-4" /> : <Database className="w-4 h-4" />;
  };

  const getDataSourceLabel = () => {
    return isUsingMockData ? 'Mock Data' : 'Supabase';
  };

  const getConnectionStatus = () => {
    if (isUsingMockData) {
      return <Badge variant="secondary">Mock Mode</Badge>;
    }
    return <Badge variant="default" className="bg-green-500">Connected</Badge>;
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getDataSourceIcon()}
            <span className="text-sm font-medium">{getDataSourceLabel()}</span>
          </div>
          {getConnectionStatus()}
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={isUsingMockData ? 'default' : 'outline'}
            onClick={toggleDataSource}
            className="text-xs"
          >
            Switch to {isUsingMockData ? 'Supabase' : 'Mock Data'}
          </Button>
        </div>

        {!isUsingMockData && (
          <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
            📡 Connected to Supabase database
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <Settings className="w-3 h-3 inline mr-1" />
          Development Mode
        </div>
      </div>
    </div>
  );
};

export default DataSourceToggle; 