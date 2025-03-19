
import React, { useState } from 'react';
import { getRecommendationPriority, formatReportContent } from '@/utils/reportUtils';
import PriorityBadge from './PriorityBadge';
import { ChevronDown, ChevronUp, AlertTriangle, Check, Clock, Info, Edit } from 'lucide-react';
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
  
  const toggleItem = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Get the appropriate icon based on priority
  const getPriorityIcon = (priority: any) => {
    if (priority.color.includes("red")) return <AlertTriangle className="h-5 w-5 text-red-600" />;
    if (priority.color.includes("amber")) return <Clock className="h-5 w-5 text-amber-600" />;
    if (priority.color.includes("green")) return <Check className="h-5 w-5 text-green-600" />;
    return <Info className="h-5 w-5 text-blue-600" />;
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
  
  // Original recommendations list processing
  const recommendations = content.split('\n').filter(item => item.trim() !== '');
  
  return (
    <div className="space-y-4 relative">
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
      
      {recommendations.map((item, i) => {
        const itemNumber = i + 1;
        const cleanItem = item.replace(/^\d+\.\s*/, '');
        const priority = getRecommendationPriority(cleanItem);
        const isExpanded = expandedItems[i] ?? false;
        
        // Split the content if it's longer than 100 characters
        const hasLongContent = cleanItem.length > 120;
        const shortContent = hasLongContent ? `${cleanItem.substring(0, 120)}...` : cleanItem;
        
        return (
          <div 
            key={i} 
            className={`flex flex-col rounded-lg backdrop-blur-sm shadow-sm border hover:shadow-md transition-all overflow-hidden ${priority.background} ${priority.border}`}
          >
            <div className="flex items-start gap-3 p-4">
              <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                {itemNumber}
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-2">
                <div className="flex-grow">
                  {hasLongContent && !isExpanded ? shortContent : cleanItem}
                </div>
                <div className="flex items-center gap-2 self-start mt-1 sm:mt-0">
                  <PriorityBadge priority={priority} />
                  {hasLongContent && (
                    <button 
                      onClick={() => toggleItem(i)}
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
                  priority.border,
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 hidden"
                )}
              >
                <div className="p-4 pt-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      {cleanItem}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RecommendationsList;
