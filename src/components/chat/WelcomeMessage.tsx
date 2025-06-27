
import React from 'react';
import { useNovaMemory } from '../../hooks/useNovaMemory';

interface WelcomeMessageProps {
  promptChips?: string[];
  onChipClick: (chipText: string) => void;
}

const WelcomeMessage = ({ promptChips, onChipClick }: WelcomeMessageProps) => {
  const { generatePersonalizedPrompts, hasMemoryData } = useNovaMemory();

  const generatePromptChips = (): string[] => {
    // If custom chips are provided, use them
    if (promptChips && promptChips.length > 0) {
      return promptChips;
    }

    // If we have memory data, generate personalized prompts
    if (hasMemoryData) {
      const personalizedPrompts = generatePersonalizedPrompts();
      if (personalizedPrompts.length > 0) {
        return personalizedPrompts;
      }
    }

    // Fallback to default prompts
    return [
      "Show me what's nearby",
      "Looking for chill vibes", 
      "Perfect date night spot",
      "Where's the live music?",
      "Find hidden gems"
    ];
  };

  const chips = generatePromptChips();

  return (
    <div className="p-6">
      <div className="bg-card border border-border p-4 rounded-2xl mb-6">
        <p className="text-sm leading-relaxed text-foreground">
          Hi! I'm Nova, your AI planner. What kind of night are you looking for?
        </p>
      </div>

      {/* Prompt Chips */}
      <div className="overflow-x-auto overscroll-x-contain pb-2">
        <div className="flex space-x-3 min-w-max">
          {chips.map((chip, index) => (
            <button
              key={index}
              onClick={() => onChipClick(chip)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium whitespace-nowrap hover:bg-secondary/80 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
