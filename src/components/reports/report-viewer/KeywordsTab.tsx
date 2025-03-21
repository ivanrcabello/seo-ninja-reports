
import React from 'react';
import { Keyword } from '@/types/report.types';

interface KeywordsTabProps {
  keywords: Keyword[];
  isEditing?: boolean;
  onSave?: (content: string) => Promise<void>;
  keywordsAnalysis?: string;
}

const KeywordsTab: React.FC<KeywordsTabProps> = ({ 
  keywords, 
  isEditing = false,
  onSave,
  keywordsAnalysis = '' 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {keywords && keywords.length > 0 ? (
          <div className="bg-card rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Keywords ({keywords.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {keywords.map((keyword) => (
                <div 
                  key={keyword.id} 
                  className="border p-2 rounded flex justify-between items-center"
                >
                  <span className="font-medium">{keyword.keyword}</span>
                  <div className="flex gap-2">
                    {keyword.searchVolume !== undefined && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {keyword.searchVolume} búsquedas
                      </span>
                    )}
                    {keyword.difficulty !== undefined && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        Dificultad: {keyword.difficulty}/100
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-muted/20 rounded-lg p-4 text-center">
            No hay keywords disponibles para este informe.
          </div>
        )}
        
        {keywordsAnalysis && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Análisis de Keywords</h3>
            <div className="prose max-w-none">
              {isEditing ? (
                <textarea
                  className="w-full min-h-[200px] p-2 border rounded"
                  value={keywordsAnalysis}
                  onChange={(e) => {
                    // This would be handled via the onSave callback
                  }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: keywordsAnalysis }} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordsTab;
