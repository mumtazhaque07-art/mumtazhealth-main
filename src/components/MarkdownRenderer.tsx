import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split by newlines first
  const blocks = content.split('\n\n');

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const trimmedBlock = block.trim();
        
        // Headers (H3)
        if (trimmedBlock.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-serif font-bold text-gray-900 mt-6 mb-3">
              {trimmedBlock.substring(4)}
            </h3>
          );
        }
        
        // Headers (H4)
        if (trimmedBlock.startsWith('#### ')) {
          return (
            <h4 key={index} className="text-lg font-medium text-gray-800 mt-4 mb-2">
              {trimmedBlock.substring(5)}
            </h4>
          );
        }

        // Unordered Lists
        if (trimmedBlock.split('\n').every(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))) {
          const items = trimmedBlock.split('\n');
          return (
            <ul key={index} className="list-disc pl-5 space-y-2 my-4">
              {items.map((item, i) => (
                <li key={i} className="text-gray-700">
                  {parseInlineFormatting(item.replace(/^[-*]\s/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Default Paragraph
        return (
          <p key={index} className="text-gray-700 leading-relaxed">
            {parseInlineFormatting(trimmedBlock)}
          </p>
        );
      })}
    </div>
  );
};

// Helper function to parse bold and italic inline
function parseInlineFormatting(text: string) {
  // A naive approach to parse **bold** and *italic*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-gray-800">{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
