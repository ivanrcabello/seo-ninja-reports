
import React from 'react';
import { getRecommendationPriority, formatReportContent } from '@/utils/reportUtils';
import PriorityBadge from './PriorityBadge';

interface RecommendationsListProps {
  content: string;
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ content }) => {
  // If content is already HTML formatted
  if (content.includes('<li') || content.includes('<p') || content.includes('<h')) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: formatReportContent(content) }} 
        className="prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold" 
      />
    );
  }
  
  // Original recommendations list processing
  const recommendations = content.split('\n').filter(item => item.trim() !== '');
  
  return (
    <div className="space-y-3">
      {recommendations.map((item, i) => {
        const itemNumber = i + 1;
        const cleanItem = item.replace(/^\d+\.\s*/, '');
        const priority = getRecommendationPriority(cleanItem);
        
        return (
          <div 
            key={i} 
            className={`flex items-start gap-3 p-4 rounded-lg backdrop-blur-sm shadow-sm border hover:shadow-md transition-all ${priority.background} ${priority.color} ${priority.border}`}
          >
            <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              {itemNumber}
            </div>
            <div className="flex-1 flex items-start gap-2">
              <div className="flex-grow">
                {cleanItem}
              </div>
              <PriorityBadge priority={priority} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendationsList;
