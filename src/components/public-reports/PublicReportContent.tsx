import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlurredCard from '@/components/ui/BlurredCard';
import { formatReportContent, getRecommendationPriority } from '@/utils/reportUtils';
import { ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Info, MapPin, Star, FileText } from 'lucide-react';
import RecommendationsList from '@/components/reports/report-section/RecommendationsList';

interface ReportContentType {
  executiveSummary: string;
  technicalAnalysis: string;
  contentAnalysis: string;
  backlinksAnalysis: string;
  recommendations: string;
  localSeo?: string;
  serviceProposal?: string;
  keywords?: string;
}

interface PublicReportContentProps {
  content: ReportContentType;
}

const PublicReportContent: React.FC<PublicReportContentProps> = ({ content }) => {
  // Calculate how many tabs to show based on available content
  const hasLocalSeo = content.localSeo && content.localSeo.trim() !== '';
  const hasProposal = content.serviceProposal && content.serviceProposal.trim() !== '';
  const hasKeywords = content.keywords && content.keywords.trim() !== '';
  
  // Count standard tabs (always show these 5)
  const tabCount = 5 + (hasLocalSeo ? 1 : 0) + (hasProposal ? 1 : 0) + (hasKeywords ? 1 : 0);
  const gridCols = tabCount <= 5 ? 5 : (tabCount <= 7 ? 4 : 3);
  
  return (
    <div className="w-full max-w-4xl">
      <Tabs defaultValue="executive-summary" className="w-full">
        <TabsList className={`w-full grid grid-cols-2 md:grid-cols-${gridCols} h-auto p-1 bg-gradient-to-r from-primary/5 to-background backdrop-blur-sm rounded-lg border border-primary/10`}>
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
          
          {hasLocalSeo && (
            <TabsTrigger value="local-seo" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">SEO Local</span>
                <span className="sm:hidden">Local</span>
              </div>
            </TabsTrigger>
          )}
          
          {hasProposal && (
            <TabsTrigger value="proposal" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Propuesta</span>
                <span className="sm:hidden">Propuesta</span>
              </div>
            </TabsTrigger>
          )}
          
          {hasKeywords && (
            <TabsTrigger value="keywords" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Palabras Clave</span>
                <span className="sm:hidden">Keywords</span>
              </div>
            </TabsTrigger>
          )}
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
            <RecommendationsList content={content.recommendations} />
          </BlurredCard>
        </TabsContent>
        
        {hasLocalSeo && (
          <TabsContent value="local-seo">
            <BlurredCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-500" />
                SEO Local
              </h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
                   dangerouslySetInnerHTML={{ __html: formatReportContent(content.localSeo || '') }}>
              </div>
            </BlurredCard>
          </TabsContent>
        )}
        
        {hasProposal && (
          <TabsContent value="proposal">
            <BlurredCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Propuesta de Servicios
              </h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
                   dangerouslySetInnerHTML={{ __html: formatReportContent(content.serviceProposal || '') }}>
              </div>
            </BlurredCard>
          </TabsContent>
        )}
        
        {hasKeywords && (
          <TabsContent value="keywords">
            <BlurredCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gradient-primary flex items-center gap-2">
                <FileText className="h-5 w-5 text-teal-500" />
                Palabras Clave
              </h2>
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-primary prose-strong:text-primary/90 prose-strong:font-semibold"
                   dangerouslySetInnerHTML={{ __html: formatReportContent(content.keywords || '') }}>
              </div>
            </BlurredCard>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PublicReportContent;
