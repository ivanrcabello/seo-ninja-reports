
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PenLine } from 'lucide-react';
import BlurredCard from '../ui/BlurredCard';
import AnimatedContainer from '../ui/AnimatedContainer';
import { getRecommendationPriority, formatReportContent } from '@/utils/reportUtils';

interface ReportSectionProps {
  title: string;
  content: string;
  sectionKey: string;
  onEdit: (section: string, content: string) => void;
  isEditing: boolean;
  delay?: number;
  isRecommendations?: boolean;
}

const ReportSection: React.FC<ReportSectionProps> = ({
  title,
  content,
  sectionKey,
  onEdit,
  isEditing,
  delay = 0,
  isRecommendations = false
}) => {
  if (!content || content.trim() === '') {
    return (
      <AnimatedContainer animation="fade" delay={delay} className="mt-4">
        <BlurredCard className="p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No hay contenido disponible</h3>
          <p className="text-muted-foreground">Esta sección aún no tiene contenido.</p>
        </BlurredCard>
      </AnimatedContainer>
    );
  }

  return (
    <AnimatedContainer animation="fade" delay={delay} className="mt-4">
      <BlurredCard className="glass-card bg-gradient-to-br from-background/90 via-background/80 to-background/70">
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gradient-primary">{title}</CardTitle>
          {isEditing && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary hover:bg-primary/10"
              onClick={() => onEdit(sectionKey, content)}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </CardHeader>
        <Separator className="bg-primary/10" />
        <CardContent className="pt-6">
          <div className="prose prose-sm md:prose-base max-w-none">
            {isRecommendations ? <RecommendationsList content={content} /> : <FormattedContent content={content} />}
          </div>
        </CardContent>
      </BlurredCard>
    </AnimatedContainer>
  );
};

const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
  const formattedHtml = formatReportContent(content);
  return <div dangerouslySetInnerHTML={{ __html: formattedHtml }} className="prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold prose-li:my-1" />;
};

const RecommendationsList: React.FC<{ content: string }> = ({ content }) => {
  // If content is already HTML formatted
  if (content.includes('<li') || content.includes('<p') || content.includes('<h')) {
    return <div dangerouslySetInnerHTML={{ __html: formatReportContent(content) }} className="prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold" />;
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
            <div className="flex-1">{cleanItem}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportSection;
