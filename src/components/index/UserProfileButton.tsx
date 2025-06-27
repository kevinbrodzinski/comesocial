
import React from 'react';
import { User } from 'lucide-react';
import { NotificationBadge } from '../ui/notification-badge';

interface UserProfileButtonProps {
  unreadCount: number;
  hasUnread: boolean;
  onClick: () => void;
}

const UserProfileButton = ({
  unreadCount,
  hasUnread,
  onClick
}: UserProfileButtonProps) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <NotificationBadge count={unreadCount} show={hasUnread}>
        <button
          onClick={onClick}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        >
          <User size={20} />
        </button>
      </NotificationBadge>
    </div>
  );
};

export default UserProfileButton;
