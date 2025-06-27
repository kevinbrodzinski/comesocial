
import React from 'react';
import EnhancedSmartTag from './EnhancedSmartTag';
import { SmartReference } from '@/types/smartLinking';

interface MessageWithSmartLinksProps {
  content: string;
  smartReferences?: SmartReference[];
  className?: string;
}

const MessageWithSmartLinks = ({ 
  content, 
  smartReferences = [], 
  className = ""
}: MessageWithSmartLinksProps) => {
  if (!smartReferences.length) {
    return <span className={className}>{content}</span>;
  }

  // Sort references by position
  const sortedRefs = [...smartReferences].sort((a, b) => a.position - b.position);
  
  const elements: (string | React.ReactElement)[] = [];
  let lastIndex = 0;

  sortedRefs.forEach((ref, index) => {
    // Add text before this reference
    if (ref.position > lastIndex) {
      const textBefore = content.substring(lastIndex, ref.position);
      if (textBefore) {
        elements.push(textBefore);
      }
    }

    // Add the enhanced smart tag
    elements.push(
      <EnhancedSmartTag
        key={`${ref.type}-${ref.id}-${index}`}
        reference={ref}
        className="mx-1"
      />
    );

    lastIndex = ref.position + ref.length;
  });

  // Add remaining text after the last reference
  if (lastIndex < content.length) {
    const textAfter = content.substring(lastIndex);
    if (textAfter) {
      elements.push(textAfter);
    }
  }

  return (
    <span className={className}>
      {elements.map((element, index) => 
        typeof element === 'string' ? element : React.cloneElement(element, { key: index })
      )}
    </span>
  );
};

export default MessageWithSmartLinks;
