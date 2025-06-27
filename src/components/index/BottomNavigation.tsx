
import React from 'react';
import { NotificationBadge } from '../ui/notification-badge';
import { navigationTabs } from '../../config/navigationConfig';

interface BottomNavigationProps {
  activeTab: string;
  invitationCount: number;
  onTabChange: (tab: string) => void;
  onPlannerOpen: () => void;
}

const BottomNavigation = ({
  activeTab,
  invitationCount,
  onTabChange,
  onPlannerOpen
}: BottomNavigationProps) => {
  const handleTabClick = (tabId: string) => {
    console.log('BottomNavigation: Tab clicked:', tabId);
    
    if (tabId === 'planner') {
      onPlannerOpen();
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <div className="bg-card border-t border-border h-16 w-full">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto h-full">
        {navigationTabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === 'planner' && invitationCount > 0;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all relative ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {showBadge ? (
                <NotificationBadge count={invitationCount} show={true}>
                  <IconComponent 
                    size={20} 
                    className={isActive ? 'text-primary' : ''} 
                  />
                </NotificationBadge>
              ) : (
                <IconComponent 
                  size={20} 
                  className={isActive ? 'text-primary' : ''} 
                />
              )}
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
