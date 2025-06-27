
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MessagesHeader from '../components/messages/MessagesHeader';
import MessagesSearchBar from '../components/messages/MessagesSearchBar';
import MessagesTabs from '../components/messages/MessagesTabs';
import FloatingActionButton from '../components/messages/FloatingActionButton';
import FriendSelectorModal from '../components/messages/FriendSelectorModal';
import ChatWindow from '../components/messages/ChatWindow';
import NotificationService, { MessageThread } from '../services/NotificationService';

interface MessagesViewProps {
  onBack: () => void;
}

const MessagesView = ({ onBack }: MessagesViewProps) => {
  console.log('MessagesView: Component rendered with onBack:', typeof onBack);
  
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showFriendSelector, setShowFriendSelector] = useState(false);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<MessageThread[]>([]);
  const [chatWindow, setChatWindow] = useState<{
    isOpen: boolean;
    friend: any | null;
    threadId?: string;
  }>({
    isOpen: false,
    friend: null,
    threadId: undefined
  });

  const notificationService = NotificationService.getInstance();

  const handleBack = () => {
    console.log('MessagesView: handleBack called, calling onBack prop');
    onBack();
  };

  useEffect(() => {
    // Subscribe to message updates
    const unsubscribe = notificationService.subscribeToMessages((threads) => {
      setMessageThreads(threads.map(thread => ({
        ...thread,
        isPinned: thread.isPinned || false
      })));
    });

    // Get initial threads
    const initialThreads = notificationService.getMessageThreads();
    setMessageThreads(initialThreads.map(thread => ({
      ...thread,
      isPinned: thread.isPinned || false
    })));

    // Handle URL parameters for highlighting specific plan threads
    const highlightPlanId = searchParams.get('highlight');
    if (highlightPlanId && activeTab === 'plans') {
      setTimeout(() => {
        const element = document.querySelector(`[data-plan-id="${highlightPlanId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }

    return () => {
      unsubscribe();
    };
  }, [searchParams, activeTab]);

  // Handle search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredThreads(messageThreads);
    } else {
      // Use the MessageService search functionality
      const messageService = (notificationService as any).messageService;
      const searchResults = messageService.searchThreads(searchQuery);
      setFilteredThreads(searchResults);
    }
  }, [searchQuery, messageThreads]);

  const handleTabChange = (tab: string) => {
    // Ensure we only allow valid tabs - include 'groups' in the validation
    if (['plans', 'messages', 'groups', 'pings'].includes(tab)) {
      setActiveTab(tab);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleThreadClick = (thread: MessageThread) => {
    console.log('Opening thread:', thread.id);
    
    // Mark thread as read
    const notificationService = NotificationService.getInstance();
    notificationService.markThreadAsRead(thread.id);
    
    // Open chat window with thread context
    setChatWindow({
      isOpen: true,
      friend: {
        id: thread.friend.id,
        name: thread.friend.name,
        avatar: thread.friend.avatar || thread.friend.name.charAt(0),
        status: 'active',
        location: thread.venue?.name,
        lastSeen: 'Active now'
      },
      threadId: thread.id
    });
  };

  const handleNewMessage = () => {
    setShowFriendSelector(true);
  };

  const handleSelectFriend = (friend: any) => {
    setChatWindow({
      isOpen: true,
      friend: {
        id: friend.id,
        name: friend.name,
        avatar: friend.avatar,
        status: friend.status,
        location: friend.location,
        plan: friend.plan,
        lastSeen: friend.lastSeen
      },
      threadId: undefined // New conversation
    });
  };

  const handleQuickReply = (thread: MessageThread, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Quick reply to:', thread.friend.name);
    handleThreadClick(thread);
  };

  const handleJoinVenue = (thread: MessageThread, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('Joining friend at venue:', thread.venue?.name);
  };

  const handleMoreActions = (thread: MessageThread, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('More actions for:', thread.friend.name);
  };

  const unreadCount = messageThreads.filter(t => t.unread).length;

  return (
    <div className="min-h-screen bg-background">
      <MessagesHeader 
        onBack={handleBack} 
        unreadCount={unreadCount}
      />

      {/* Add proper top padding to account for fixed header */}
      <div className="pt-16 pb-20">
        {/* Search Bar */}
        <MessagesSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          resultsCount={filteredThreads.length}
          activeTab={activeTab}
        />

        <div className="px-4">
          <MessagesTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            unreadCount={unreadCount}
            messageThreads={filteredThreads}
            hoveredCard={hoveredCard}
            onThreadClick={handleThreadClick}
            onQuickReply={handleQuickReply}
            onJoinVenue={handleJoinVenue}
            onMoreActions={handleMoreActions}
            onMouseEnter={setHoveredCard}
            onMouseLeave={() => setHoveredCard(null)}
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onNewMessage={handleNewMessage} />

      {/* Friend Selector Modal */}
      <FriendSelectorModal
        isOpen={showFriendSelector}
        onClose={() => setShowFriendSelector(false)}
        onSelectFriend={handleSelectFriend}
      />

      {/* Chat Window */}
      <ChatWindow
        isOpen={chatWindow.isOpen}
        onClose={() => setChatWindow({ isOpen: false, friend: null, threadId: undefined })}
        friend={chatWindow.friend}
        threadId={chatWindow.threadId}
      />
    </div>
  );
};

export default MessagesView;
