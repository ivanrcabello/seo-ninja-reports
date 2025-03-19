
import React from 'react';
import { X } from 'lucide-react';
import { Keyword } from '@/types/report.types';

interface KeywordTagsProps {
  keywords: Keyword[];
  onRemove: (id: string) => Promise<boolean>;
}

const KeywordTags: React.FC<KeywordTagsProps> = ({ keywords, onRemove }) => {
  if (keywords.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay palabras clave añadidas.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <div 
          key={keyword.id} 
          className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-1"
        >
          <span>{keyword.keyword}</span>
          {keyword.searchVolume && (
            <span className="text-xs">({keyword.searchVolume})</span>
          )}
          {keyword.difficulty && (
            <span className="text-xs">{keyword.difficulty}/100</span>
          )}
          <button 
            onClick={() => onRemove(keyword.id)}
            className="ml-1 text-primary/70 hover:text-primary transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default KeywordTags;
