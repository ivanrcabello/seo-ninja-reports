
import React from 'react';
import { Keyword } from '@/types/report.types';
import FormattedContent from '../../report-section/FormattedContent';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import KeywordTags from '../../keywords/KeywordTags';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface KeywordsSectionProps {
  keywordsContent?: string;
  keywords: Keyword[];
  reportId?: string;
  isEditing?: boolean;
  isPublic?: boolean;
  onEdit?: (content: string) => void;
}

const KeywordsSection: React.FC<KeywordsSectionProps> = ({
  keywordsContent = '',
  keywords = [],
  reportId,
  isEditing = false,
  isPublic = false,
  onEdit,
}) => {
  return (
    <div className="space-y-8">
      {/* Display keywords tags if available */}
      {keywords && keywords.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Palabras Clave</h2>
            {!isPublic && reportId && keywords.length > 0 && (
              <KeywordTags 
                keywords={keywords} 
                onRemove={async () => false}
              />
            )}
          </div>
          
          {/* Display keywords in a grid for better visibility - SEMrush inspired */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {keywords.map((keyword) => (
              <Card key={keyword.id} className="border p-4 rounded overflow-hidden hover:shadow-md transition-all">
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">{keyword.keyword}</span>
                    <div className="flex gap-2">
                      {keyword.searchVolume !== undefined && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {keyword.searchVolume} búsquedas
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {keyword.difficulty !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Dificultad</span>
                        <span className="font-semibold">{keyword.difficulty}/100</span>
                      </div>
                      <Progress 
                        value={keyword.difficulty} 
                        className="h-2"
                        indicatorClassName={
                          keyword.difficulty > 70 ? "bg-red-500" : 
                          keyword.difficulty > 40 ? "bg-amber-500" : 
                          "bg-green-500"
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Fácil</span>
                        <span>Difícil</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Potential section - just for visual enhancement */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Potencial</span>
                      <span className="font-semibold">
                        {keyword.searchVolume && keyword.difficulty 
                          ? Math.round(100 - (keyword.difficulty * 0.7)) 
                          : 65}/100
                      </span>
                    </div>
                    <Progress 
                      value={keyword.searchVolume && keyword.difficulty 
                        ? Math.round(100 - (keyword.difficulty * 0.7)) 
                        : 65} 
                      className="h-2"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Only show written content if it exists */}
      {keywordsContent && (
        <div className="relative mt-6">
          {isEditing && !isPublic && onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="absolute right-0 top-0"
              onClick={() => onEdit(keywordsContent)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
          <FormattedContent content={keywordsContent} />
        </div>
      )}
    </div>
  );
};

export default KeywordsSection;
