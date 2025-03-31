
import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className }) => {
  // Simple markdown formatter for basic formatting
  const formatMarkdown = (text: string) => {
    if (!text) return '';
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/\n\n/g, '<br/><br/>') // Line breaks
      .replace(/^- (.*)/gm, '<li>$1</li>') // Lists
      .replace(/<li>/g, '<ul><li>').replace(/<\/li>(?![\s\S]*<li>)/g, '</li></ul>'); // Wrap lists
  };

  return (
    <div 
      className={cn("prose max-w-none dark:prose-invert", className)}
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
    />
  );
};

export default MarkdownContent;
