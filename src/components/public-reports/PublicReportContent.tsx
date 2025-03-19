
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlurredCard from '@/components/ui/BlurredCard';
import { formatReportContent, getRecommendationPriority } from '@/utils/reportUtils';
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ReportContentType {
  executiveSummary: string;
  technicalAnalysis: string;
  contentAnalysis: string;
  backlinksAnalysis: string;
  recommendations: string;
}

interface PublicReportContentProps {
  content: ReportContentType;
}

const PublicReportContent: React.FC<PublicReportContentProps> = ({ content }) => {
  return (
    <div className="w-full max-w-4xl">
      <Tabs defaultValue="executive-summary" className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto p-1 bg-gradient-to-r from-primary/5 to-background backdrop-blur-sm rounded-lg border border-primary/10">
          <TabsTrigger value="executive-summary" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Resumen Ejecutivo</span>
              <span className="sm:hidden">Resumen</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="technical" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Técnico</span>
              <span className="sm:hidden">Técnico</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="content" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="flex items-center gap-1.5">
              <ArrowUp className="h-4 w-4" />
              <span className="hidden sm:inline">Contenido</span>
              <span className="sm:hidden">Contenido</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="backlinks" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="h-4 w-4" />
              <span className="hidden sm:inline">Backlinks</span>
              <span className="sm:hidden">Backlinks</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Recomendaciones</span>
              <span className="sm:hidden">Recom.</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="executive-summary">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Resumen Ejecutivo
            </h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.executiveSummary) }}>
            </div>
          </BlurredCard>
        </TabsContent>
        
        <TabsContent value="technical">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Análisis Técnico
            </h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.technicalAnalysis) }}>
            </div>
          </BlurredCard>
        </TabsContent>
        
        <TabsContent value="content">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-purple-500" />
              Análisis de Contenido
            </h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.contentAnalysis) }}>
            </div>
          </BlurredCard>
        </TabsContent>
        
        <TabsContent value="backlinks">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-amber-500" />
              Análisis de Backlinks y Autoridad
            </h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.backlinksAnalysis) }}>
            </div>
          </BlurredCard>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Recomendaciones y Acciones
            </h2>
            <RecommendationsContent content={content.recommendations} />
          </BlurredCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RecommendationsContent: React.FC<{ content: string }> = ({ content }) => {
  // If the content already has HTML structure
  if (content.includes('<li') || content.includes('<p') || content.includes('<h')) {
    return (
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold" 
           dangerouslySetInnerHTML={{ __html: formatReportContent(content) }}>
      </div>
    );
  }
  
  // Process as plain text with recommendations
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

const PriorityBadge: React.FC<{ priority: any }> = ({ priority }) => {
  let badgeClass = "";
  let badgeText = "";
  
  if (priority.color.includes("red")) {
    badgeClass = "bg-red-100 text-red-800 border-red-200";
    badgeText = "Alta prioridad";
  } else if (priority.color.includes("amber")) {
    badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
    badgeText = "Media prioridad";
  } else if (priority.color.includes("green")) {
    badgeClass = "bg-green-100 text-green-800 border-green-200";
    badgeText = "Baja prioridad";
  } else {
    badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
    badgeText = "Informativa";
  }
  
  return (
    <Badge className={`${badgeClass} text-xs font-medium border whitespace-nowrap self-start flex-shrink-0`}>
      {badgeText}
    </Badge>
  );
};

export default PublicReportContent;
