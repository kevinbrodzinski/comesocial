
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SmartSuggestionDropdown from './SmartSuggestionDropdown';
import { useSmartSuggestions } from './useSmartSuggestions';
import { SmartReference, SmartSuggestion } from '@/types/smartLinking';

interface EnhancedMessageInputProps {
  message: string;
  onMessageChange: (message: string, references?: SmartReference[]) => void;
  onSendMessage: () => void;
  placeholder?: string;
  className?: string;
  contextType?: 'general' | 'group-chat' | 'plan-thread' | 'direct-message';
  contextId?: string | number;
  participantIds?: number[];
}

const EnhancedMessageInput = ({
  message,
  onMessageChange,
  onSendMessage,
  placeholder = "Type a message...",
  className = "",
  contextType = 'general',
  contextId,
  participantIds = []
}: EnhancedMessageInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [smartReferences, setSmartReferences] = useState<SmartReference[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggestions, searchSmartSuggestions, clearSuggestions } = useSmartSuggestions({
    contextType,
    contextId,
    participantIds
  });

  // Detect @ mention typing
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const checkForMention = () => {
      const value = input.value;
      const cursor = input.selectionStart || 0;
      
      // Find @ symbol before cursor
      let atIndex = -1;
      for (let i = cursor - 1; i >= 0; i--) {
        if (value[i] === '@') {
          atIndex = i;
          break;
        }
        if (value[i] === ' ' || value[i] === '\n') {
          break;
        }
      }

      if (atIndex !== -1) {
        const query = value.substring(atIndex + 1, cursor);
        if (query.length >= 0) {
          setCurrentQuery(query);
          setShowSuggestions(true);
          setSelectedIndex(0);
          if (query.length >= 1) {
            searchSmartSuggestions(query);
          }
        }
      } else {
        setShowSuggestions(false);
        clearSuggestions();
      }
    };

    const handleInput = () => {
      setCursorPosition(input.selectionStart || 0);
      checkForMention();
    };

    const handleClick = () => {
      setCursorPosition(input.selectionStart || 0);
      checkForMention();
    };

    input.addEventListener('input', handleInput);
    input.addEventListener('click', handleClick);
    input.addEventListener('keyup', handleClick);

    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('click', handleClick);
      input.removeEventListener('keyup', handleClick);
    };
  }, [searchSmartSuggestions, clearSuggestions]);

  // Get all suggestions as flat array for keyboard navigation
  const allSuggestions = [
    ...suggestions.venues,
    ...suggestions.friends,
    ...suggestions.plans
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && allSuggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, allSuggestions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < allSuggestions.length) {
            selectSuggestion(allSuggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          clearSuggestions();
          break;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onSendMessage();
    }
  };

  const selectSuggestion = (suggestion: SmartSuggestion) => {
    const input = inputRef.current;
    if (!input) return;

    const value = input.value;
    const cursor = input.selectionStart || 0;
    
    // Find the @ symbol before cursor
    let atIndex = -1;
    for (let i = cursor - 1; i >= 0; i--) {
      if (value[i] === '@') {
        atIndex = i;
        break;
      }
    }

    if (atIndex !== -1) {
      const before = value.substring(0, atIndex);
      const after = value.substring(cursor);
      const mentionText = `@${suggestion.name} `;
      const newValue = before + mentionText + after;
      
      // Create new smart reference
      const newRef: SmartReference = {
        id: suggestion.id,
        name: suggestion.name,
        position: atIndex,
        length: mentionText.length - 1, // Exclude the trailing space
        type: suggestion.type as SmartReference['type']
      };
      
      const updatedRefs = [...smartReferences, newRef];
      setSmartReferences(updatedRefs);
      
      onMessageChange(newValue, updatedRefs);
      
      // Set cursor position after the mention
      setTimeout(() => {
        if (input) {
          const newCursorPos = atIndex + mentionText.length;
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }

    setShowSuggestions(false);
    clearSuggestions();
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onMessageChange(newValue, smartReferences);
  };

  return (
    <div className={`relative ${className}`}>
      <SmartSuggestionDropdown
        suggestions={suggestions}
        isVisible={showSuggestions}
        onSelect={selectSuggestion}
        selectedIndex={selectedIndex}
        query={currentQuery}
      />
      
      <div className="flex space-x-2">
        <Input
          ref={inputRef}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button 
          onClick={onSendMessage}
          disabled={!message.trim()}
          className="px-3"
        >
          <Send size={16} />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Type @ to mention venues, friends, or plans • Enhanced smart linking
      </p>
    </div>
  );
};

export default EnhancedMessageInput;
