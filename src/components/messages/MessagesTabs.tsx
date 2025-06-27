
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessageThreadCard from './MessageThreadCard';
import PlanThreadCard from './PlanThreadCard';
import EmptyMessagesState from './EmptyMessagesState';
import { MessageThread } from '@/services/NotificationService';

interface MessagesTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount: number;
  messageThreads: MessageThread[];
  hoveredCard: string | null;
  onThreadClick: (thread: MessageThread) => void;
  onQuickReply: (thread: MessageThread, event: React.MouseEvent) => void;
  onJoinVenue: (thread: MessageThread, event: React.MouseEvent) => void;
  onMoreActions: (thread: MessageThread, event: React.MouseEvent) => void;
  onMouseEnter: (cardId: string) => void;
  onMouseLeave: () => void;
}

const MessagesTabs = ({
  activeTab,
  onTabChange,
  unreadCount,
  messageThreads,
  hoveredCard,
  onThreadClick,
  onQuickReply,
  onJoinVenue,
  onMoreActions,
  onMouseEnter,
  onMouseLeave
}: MessagesTabsProps) => {
  const filterThreads = (type: string) => {
    switch (type) {
      case 'plans':
        return messageThreads.filter(thread => thread.type === 'plan');
      case 'messages':
        return messageThreads.filter(thread => thread.type === 'message' && thread.threadType === 'direct');
      case 'groups':
        return messageThreads.filter(thread => thread.threadType === 'group' || thread.threadType === 'map-group');
      case 'pings':
        return messageThreads.filter(thread => thread.type === 'ping');
      default:
        return messageThreads;
    }
  };

  const filteredThreads = filterThreads(activeTab);
  const plansCount = messageThreads.filter(t => t.type === 'plan' && t.unread).length;
  const messagesCount = messageThreads.filter(t => t.type === 'message' && t.threadType === 'direct' && t.unread).length;
  const groupsCount = messageThreads.filter(t => (t.threadType === 'group' || t.threadType === 'map-group') && t.unread).length;
  const pingsCount = messageThreads.filter(t => t.type === 'ping' && t.unread).length;

  const renderThreadCard = (thread: MessageThread) => {
    if (thread.type === 'plan') {
      return (
        <PlanThreadCard
          key={thread.id}
          thread={thread}
          onClick={() => onThreadClick(thread)}
        />
      );
    }

    return (
      <MessageThreadCard
        key={thread.id}
        thread={thread}
        isHovered={hoveredCard === thread.id}
        onClick={() => onThreadClick(thread)}
        onQuickReply={(event) => onQuickReply(thread, event)}
        onJoinVenue={(event) => onJoinVenue(thread, event)}
        onMoreActions={(event) => onMoreActions(thread, event)}
        onMouseEnter={() => onMouseEnter(thread.id)}
        onMouseLeave={onMouseLeave}
      />
    );
  };

  const renderEmptyState = (tabType: string) => {
    const emptyStateMessages = {
      plans: 'No active plans with group chats yet. Join a plan or create one to start chatting!',
      messages: 'No direct messages yet. Start a conversation with a friend!',
      groups: 'No group chats yet. Start a venue chat or join a plan to begin group conversations!',
      pings: 'No location pings yet. Send a ping to let friends know where you are!'
    };

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">{emptyStateMessages[tabType as keyof typeof emptyStateMessages]}</p>
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-4">
        <TabsTrigger value="plans" className="relative">
          Plans
          {plansCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {plansCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="messages" className="relative">
          Messages
          {messagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {messagesCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="groups" className="relative">
          Groups
          {groupsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {groupsCount}
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="pings" className="relative">
          Pings
          {pingsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {pingsCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="plans" className="space-y-2">
        {filteredThreads.length === 0 ? (
          renderEmptyState('plans')
        ) : (
          filteredThreads.map(renderThreadCard)
        )}
      </TabsContent>

      <TabsContent value="messages" className="space-y-2">
        {filteredThreads.length === 0 ? (
          renderEmptyState('messages')
        ) : (
          filteredThreads.map(renderThreadCard)
        )}
      </TabsContent>

      <TabsContent value="groups" className="space-y-2">
        {filteredThreads.length === 0 ? (
          renderEmptyState('groups')
        ) : (
          filteredThreads.map(renderThreadCard)
        )}
      </TabsContent>

      <TabsContent value="pings" className="space-y-2">
        {filteredThreads.length === 0 ? (
          renderEmptyState('pings')
        ) : (
          filteredThreads.map(renderThreadCard)
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MessagesTabs;
