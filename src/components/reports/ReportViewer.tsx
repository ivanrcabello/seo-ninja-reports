
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share, Calendar, Globe, Activity } from 'lucide-react';
import BlurredCard from '../ui/BlurredCard';
import AnimatedContainer from '../ui/AnimatedContainer';
import { Report } from '@/hooks/useReports';
import { format } from 'date-fns';

interface ReportViewerProps {
  report: Report;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const { title, date, url, content } = report;
  
  if (!content) {
    return (
      <BlurredCard className="p-12 text-center">
        <h3 className="text-xl font-medium mb-2">No report content available</h3>
        <p className="text-muted-foreground">This report doesn't have any content yet.</p>
      </BlurredCard>
    );
  }
  
  return (
    <div className="space-y-8">
      <BlurredCard className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(date), 'MMM d, yyyy')}</span>
              </div>
              {url && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {url.replace(/^https?:\/\//, '').split('/')[0]}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 self-end md:self-auto">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </BlurredCard>
      
      <Tabs defaultValue="executive-summary" className="w-full">
        <TabsList className="w-full grid grid-cols-3 md:grid-cols-5 h-auto p-1 bg-muted/30 backdrop-blur-sm rounded-lg">
          <TabsTrigger value="executive-summary" className="py-2">Executive Summary</TabsTrigger>
          <TabsTrigger value="technical" className="py-2">Technical</TabsTrigger>
          <TabsTrigger value="content" className="py-2">Content</TabsTrigger>
          <TabsTrigger value="backlinks" className="py-2">Backlinks</TabsTrigger>
          <TabsTrigger value="recommendations" className="py-2">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="executive-summary">
          <ReportSection
            title="Executive Summary"
            content={content.executiveSummary}
            delay={0}
          />
        </TabsContent>
        
        <TabsContent value="technical">
          <ReportSection
            title="Technical Analysis"
            content={content.technicalAnalysis}
            delay={0}
          />
        </TabsContent>
        
        <TabsContent value="content">
          <ReportSection
            title="Content Analysis"
            content={content.contentAnalysis}
            delay={0}
          />
        </TabsContent>
        
        <TabsContent value="backlinks">
          <ReportSection
            title="Backlinks & Authority Analysis"
            content={content.backlinksAnalysis}
            delay={0}
          />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <ReportSection
            title="Recommendations & Actions"
            content={content.recommendations}
            delay={0}
            isRecommendations
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ReportSectionProps {
  title: string;
  content: string;
  delay?: number;
  isRecommendations?: boolean;
}

const ReportSection: React.FC<ReportSectionProps> = ({
  title,
  content,
  delay = 0,
  isRecommendations = false
}) => {
  // Format content based on type
  const formattedContent = isRecommendations
    ? content.split('\n').map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg mb-2">
          <div className="bg-primary/10 text-primary font-medium rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
            {(i + 1)}
          </div>
          <div className="flex-1">{item.replace(/^\d+\.\s*/, '')}</div>
        </div>
      ))
    : content.split('\n').map((paragraph, i) => (
        <p key={i} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ));

  return (
    <AnimatedContainer animation="fade" delay={delay} className="mt-4">
      <BlurredCard>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {formattedContent}
        </CardContent>
      </BlurredCard>
    </AnimatedContainer>
  );
};

export default ReportViewer;
