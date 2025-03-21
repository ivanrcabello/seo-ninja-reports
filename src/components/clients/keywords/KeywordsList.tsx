
import React from 'react';
import { Keyword } from '@/types/report.types';
import { X, Search, TrendingUp } from 'lucide-react';
import BlurredCard from '@/components/ui/BlurredCard';

interface KeywordsListProps {
  keywords: Keyword[];
  onRemove: (id: string) => Promise<boolean>;
}

const KeywordsList: React.FC<KeywordsListProps> = ({ keywords, onRemove }) => {
  if (keywords.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/20">
        <p className="text-muted-foreground">No hay palabras clave añadidas todavía.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Palabras clave ({keywords.length})</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {keywords.map((keyword) => (
          <BlurredCard key={keyword.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary/60" />
              <span className="font-medium">{keyword.keyword}</span>
            </div>
            <div className="flex items-center gap-3">
              {keyword.searchVolume && (
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Search className="h-3 w-3" />
                  <span>{keyword.searchVolume}</span>
                </div>
              )}
              {keyword.difficulty && (
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{keyword.difficulty}/100</span>
                </div>
              )}
              <button
                onClick={() => onRemove(keyword.id)}
                className="p-1 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </BlurredCard>
        ))}
      </div>
    </div>
  );
};

export default KeywordsList;
