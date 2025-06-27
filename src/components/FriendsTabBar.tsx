
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface Tab {
  id: string;
  label: string;
  count: number;
}

interface FriendsTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const FriendsTabBar = ({ tabs, activeTab, onTabChange }: FriendsTabBarProps) => {
  // Reorder tabs: activity, nearby, all
  const reorderedTabs = [
    tabs.find(tab => tab.id === 'activity'),
    tabs.find(tab => tab.id === 'nearby'), 
    tabs.find(tab => tab.id === 'all')
  ].filter(Boolean) as Tab[];

  return (
    <div className="flex space-x-1 bg-secondary rounded-lg p-1 relative overflow-hidden">
      <div 
        className="absolute inset-1 bg-background rounded-md shadow-lg transition-all duration-300 ease-out border border-primary/20"
        style={{
          width: `${100 / reorderedTabs.length}%`,
          transform: `translateX(${reorderedTabs.findIndex(tab => tab.id === activeTab) * 100}%)`
        }}
      />
      {reorderedTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-all relative z-10 hover:scale-105 ${
            activeTab === tab.id 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="truncate">{tab.label}</span>
          {tab.count > 0 && (
            <Badge 
              variant="outline" 
              className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 py-0 text-[10px] font-bold leading-none flex items-center justify-center transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground border-primary scale-110' 
                  : 'bg-red-500 text-white border-red-500 scale-100'
              }`}
            >
              {tab.count}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
};

export default FriendsTabBar;
