
import React, { useState, useEffect } from 'react';
import { getRecommendationPriority, formatReportContent } from '@/utils/reportUtils';
import PriorityBadge from './PriorityBadge';
import { ChevronDown, ChevronUp, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RecommendationsListProps {
  content: string;
  isPublic?: boolean;
  isEditing?: boolean;
  onEdit?: (newContent: string) => void;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ 
  content, 
  isPublic = false,
  isEditing = false,
  onEdit = () => {}
}) => {
  // State for expanded items
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [recommendations, setRecommendations] = useState<Array<{content: string, priority: any, index: number, originalIndex: number}>>([]);
  
  // Extract only the recommendations part if the content contains a full report
  useEffect(() => {
    if (!content) return;
    
    let recommendationsText = content;
    
    // If content includes sections like "SEO Técnico", "Contenido", etc., extract only the recommendations
    if (content.includes('### Recomendaciones') || content.includes('Recomendaciones:')) {
      const recommendationsMatch = content.match(/(?:### Recomendaciones|Recomendaciones:)([\s\S]*?)(?=$|### [^#])/i);
      if (recommendationsMatch && recommendationsMatch[1]) {
        recommendationsText = recommendationsMatch[1].trim();
      }
    }
    
    // Extract pure recommendations (usually numbered or bulleted lists)
    let extractedRecommendations: string[] = [];
    
    // Try to extract numbered recommendations (1. recommendation)
    const numberedItems = recommendationsText.match(/\d+\.\s*(.*?)(?=\n\d+\.|$)/gs);
    if (numberedItems && numberedItems.length > 0) {
      extractedRecommendations = numberedItems.map(item => item.trim());
    } 
    // Try to extract bulleted recommendations (- recommendation or * recommendation)
    else {
      const bulletedItems = recommendationsText.match(/[-*]\s*(.*?)(?=\n[-*]|$)/gs);
      if (bulletedItems && bulletedItems.length > 0) {
        extractedRecommendations = bulletedItems.map(item => item.trim().replace(/^[-*]\s*/, ''));
      } 
      // If no clear pattern, split by newlines
      else {
        extractedRecommendations = recommendationsText.split('\n').filter(line => 
          line.trim() !== '' && 
          !line.includes('#') && 
          !line.includes('Recomendaciones:')
        );
      }
    }
    
    // Process recommendations
    const processedRecommendations = extractedRecommendations.map((item, index) => {
      // Clean the item (remove numbers, bullets)
      const cleanItem = item.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '');
      const priority = getRecommendationPriority(cleanItem);
      
      return {
        content: cleanItem,
        priority,
        index,
        originalIndex: index + 1
      };
    });
    
    setRecommendations(processedRecommendations);
  }, [content]);
  
  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // If content is already HTML formatted
  if (content.includes('<li') || content.includes('<p') || content.includes('<h')) {
    return (
      <div className="relative">
        {isEditing && !isPublic && onEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute right-0 top-0"
            onClick={() => onEdit(content)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}
        <div 
          dangerouslySetInnerHTML={{ __html: formatReportContent(content) }} 
          className="prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold" 
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 relative">
      {isEditing && !isPublic && onEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute right-0 top-0"
          onClick={() => onEdit(content)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      )}
      
      {/* Simple list of recommendations without category filtering */}
      <div className="space-y-3">
        {recommendations.length > 0 ? (
          recommendations.map((item) => {
            const isExpanded = expandedItems[item.index] ?? false;
            
            // Split the content if it's longer than 100 characters
            const hasLongContent = item.content.length > 120;
            const shortContent = hasLongContent ? `${item.content.substring(0, 120)}...` : item.content;
            
            return (
              <div 
                key={item.index} 
                className={`flex flex-col rounded-lg backdrop-blur-sm shadow-sm border hover:shadow-md transition-all overflow-hidden ${item.priority.background} ${item.priority.border}`}
              >
                <div className="flex items-start gap-3 p-4">
                  <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                    {item.originalIndex}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-2">
                    <div className="flex-grow">
                      {hasLongContent && !isExpanded ? shortContent : item.content}
                    </div>
                    <div className="flex items-center gap-2 self-start mt-1 sm:mt-0">
                      <PriorityBadge priority={item.priority} />
                      {hasLongContent && (
                        <button 
                          onClick={() => toggleItem(item.index)}
                          className="p-1 rounded-full hover:bg-white/30 transition-colors"
                          aria-label={isExpanded ? "Colapsar" : "Expandir"}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {hasLongContent && (
                  <div 
                    className={cn(
                      "border-t transition-all duration-300 overflow-hidden", 
                      item.priority.border,
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 hidden"
                    )}
                  >
                    <div className="p-4 pt-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          {item.content}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No hay recomendaciones disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsList;
