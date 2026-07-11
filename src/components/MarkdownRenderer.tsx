import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  
  const flushList = () => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${renderedElements.length}`} className="list-disc pl-5 space-y-2 my-4">
          {[...currentList]}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(
        <li key={`li-${index}`} className="text-foreground">
          {parseInlineFormatting(trimmed.substring(2))}
        </li>
      );
    } else {
      flushList();
      
      if (trimmed === '') {
        // Just empty line, do nothing or add space
        renderedElements.push(<div key={`br-${index}`} className="h-2"></div>);
      } else if (trimmed.startsWith('### ')) {
        renderedElements.push(
          <h3 key={`h3-${index}`} className="text-xl font-serif font-bold text-foreground mt-6 mb-3">
            {parseInlineFormatting(trimmed.substring(4))}
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        renderedElements.push(
          <h4 key={`h4-${index}`} className="text-lg font-medium text-foreground mt-4 mb-2">
            {parseInlineFormatting(trimmed.substring(5))}
          </h4>
        );
      } else {
        renderedElements.push(
          <p key={`p-${index}`} className="text-foreground leading-relaxed my-1">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      }
    }
  });
  
  flushList();

  return (
    <div className="space-y-1">
      {renderedElements}
    </div>
  );
};

// Helper function to parse bold and italic inline
function parseInlineFormatting(text: string) {
  // Use a combined regex to find bold, italic, and underline tokens
  // This avoids the nested splitting issues.
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|_.*?_)/g);
  
  return parts.map((part, i) => {
    if (!part) return null;
    
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={`b-${i}`} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={`i-${i}`} className="italic text-foreground">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('_') && part.endsWith('_') && part.length > 2) {
      return <em key={`em-${i}`} className="italic text-foreground">{part.slice(1, -1)}</em>;
    }
    
    // Replace literal escaped asterisks if any
    const unescaped = part.replace(/\\\*/g, '*');
    return <React.Fragment key={`t-${i}`}>{unescaped}</React.Fragment>;
  });
}
