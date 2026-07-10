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
        <li key={`li-${index}`} className="text-gray-700">
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
          <h3 key={`h3-${index}`} className="text-xl font-serif font-bold text-gray-900 mt-6 mb-3">
            {parseInlineFormatting(trimmed.substring(4))}
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        renderedElements.push(
          <h4 key={`h4-${index}`} className="text-lg font-medium text-gray-800 mt-4 mb-2">
            {parseInlineFormatting(trimmed.substring(5))}
          </h4>
        );
      } else {
        renderedElements.push(
          <p key={`p-${index}`} className="text-gray-700 leading-relaxed my-1">
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
  // First extract bold **text**
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  
  return boldParts.map((boldPart, i) => {
    if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
      return <strong key={`b-${i}`} className="font-semibold text-gray-900">{boldPart.slice(2, -2)}</strong>;
    }
    
    // Then extract italic *text* but ensure it's not a bullet point collision
    const italicParts = boldPart.split(/(\b_[^_]+_\b|\b\*[^*]+\*\b)/g);
    
    return italicParts.map((italicPart, j) => {
      if ((italicPart.startsWith('*') && italicPart.endsWith('*')) || (italicPart.startsWith('_') && italicPart.endsWith('_'))) {
        return <em key={`i-${i}-${j}`} className="italic text-gray-800">{italicPart.slice(1, -1)}</em>;
      }
      return <React.Fragment key={`t-${i}-${j}`}>{italicPart}</React.Fragment>;
    });
  });
}
