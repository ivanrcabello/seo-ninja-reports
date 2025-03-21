
import React from 'react';
import { Keyword } from '@/types/report.types';
import FormattedContent from '../../report-section/FormattedContent';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import KeywordTags from '../../keywords/KeywordTags';

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
        </div>
      )}

      {/* Only show written content if it exists */}
      {keywordsContent && (
        <div className="relative">
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
