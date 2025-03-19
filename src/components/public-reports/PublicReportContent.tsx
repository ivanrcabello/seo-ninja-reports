
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlurredCard from '@/components/ui/BlurredCard';
import { formatReportContent } from '@/utils/reportUtils';

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
          <TabsTrigger value="executive-summary" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Resumen Ejecutivo</TabsTrigger>
          <TabsTrigger value="technical" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Técnico</TabsTrigger>
          <TabsTrigger value="content" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contenido</TabsTrigger>
          <TabsTrigger value="backlinks" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Backlinks</TabsTrigger>
          <TabsTrigger value="recommendations" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Recomendaciones</TabsTrigger>
        </TabsList>
        
        <TabsContent value="executive-summary">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Resumen Ejecutivo</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none" 
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.executiveSummary) }}>
            </div>
          </BlurredCard>
        </TabsContent>
        
        <TabsContent value="technical">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Análisis Técnico</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.technicalAnalysis) }}>
            </div>
          </BlurredCard>
        </TabsContent>
        
        <TabsContent value="content">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Análisis de Contenido</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.contentAnalysis) }}>
            </div>
          </BlurredCard>
        </TabsContent>
        
        <TabsContent value="backlinks">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Análisis de Backlinks y Autoridad</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.backlinksAnalysis) }}>
            </div>
          </BlurredCard>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <BlurredCard className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gradient-primary">Recomendaciones y Acciones</h2>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
                 dangerouslySetInnerHTML={{ __html: formatReportContent(content.recommendations) }}>
            </div>
          </BlurredCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicReportContent;
