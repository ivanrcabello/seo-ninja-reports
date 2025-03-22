
import React from 'react';
import { X, TrendingUp, TrendingDown, BarChart } from 'lucide-react';
import { Keyword } from '@/types/report.types';
import { Badge } from '@/components/ui/badge';

interface KeywordTagsProps {
  keywords: Keyword[];
  onRemove: (id: string) => Promise<boolean>;
}

const KeywordTags: React.FC<KeywordTagsProps> = ({ keywords, onRemove }) => {
  if (keywords.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay palabras clave añadidas.</p>;
  }

  // Function to determine which icon to show based on difficulty
  const getDifficultyIcon = (difficulty: number | undefined) => {
    if (!difficulty) return null;
    if (difficulty > 70) return <TrendingUp className="h-3 w-3 text-red-500" />;
    if (difficulty > 40) return <BarChart className="h-3 w-3 text-amber-500" />;
    return <TrendingDown className="h-3 w-3 text-green-500" />;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword) => (
        <Badge 
          key={keyword.id} 
          variant="outline"
          className="bg-primary/10 text-primary flex items-center gap-1 px-3 py-1 hover:bg-primary/20 transition-colors"
        >
          <span>{keyword.keyword}</span>
          {keyword.searchVolume && (
            <span className="text-xs ml-1 bg-primary/20 px-1 rounded-full">
              {keyword.searchVolume}
            </span>
          )}
          {keyword.difficulty && (
            <span className="flex items-center gap-1 ml-1 text-xs">
              {getDifficultyIcon(keyword.difficulty)}
              <span>{keyword.difficulty}</span>
            </span>
          )}
          <button 
            onClick={() => onRemove(keyword.id)}
            className="ml-1 text-primary/70 hover:text-primary transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
};

export default KeywordTags;
