
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import BlurredCard from '@/components/ui/BlurredCard';
import { formatReportContent } from '@/utils/reportUtils';
import { LucideIcon } from 'lucide-react';
import RecommendationsList from '@/components/reports/report-section/RecommendationsList';

interface ContentTabProps {
  value: string;
  title: string;
  content: string;
  icon: LucideIcon;
  iconColor: string;
  isRecommendations?: boolean;
}

const ContentTab: React.FC<ContentTabProps> = ({ 
  value, 
  title, 
  content, 
  icon: Icon, 
  iconColor, 
  isRecommendations = false 
}) => {
  return (
    <TabsContent value={value}>
      <BlurredCard className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </h2>
        {isRecommendations ? (
          <RecommendationsList content={content} />
        ) : (
          <div 
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: formatReportContent(content) }}
          />
        )}
      </BlurredCard>
    </TabsContent>
  );
};

export default ContentTab;
