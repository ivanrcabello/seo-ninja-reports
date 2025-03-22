
import React from 'react';
import { Keyword } from '@/types/report.types';
import FormattedContent from '../../report-section/FormattedContent';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import KeywordTags from '../../keywords/KeywordTags';
import { Card, CardContent } from '@/components/ui/card';

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
          
          {/* Display keywords in a grid for better visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {keywords.map((keyword) => (
              <Card key={keyword.id} className="border p-2 rounded">
                <CardContent className="p-2 flex justify-between items-center">
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
