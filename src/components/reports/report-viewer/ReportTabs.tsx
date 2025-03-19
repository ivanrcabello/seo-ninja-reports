
import React from 'react';
import { Report } from '@/types/report.types';
import { ScrollArea } from "@/components/ui/scroll-area";
import ReportSection from '../report-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageSpeedTab from './PageSpeedTab';
import { FileBarChart, Layers, SearchCode, KeyRound, FileText, Globe, Gauge, CheckCircle2, LightbulbIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportTabsProps {
  report: Report;
  pageSpeedData?: any;
  isLoadingPageSpeed?: boolean;
  isEditing?: boolean;
  onEdit?: (sectionKey: string) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ 
  report, 
  pageSpeedData, 
  isLoadingPageSpeed = false,
  isEditing = false,
  onEdit = () => {}
}) => {
  const { content } = report;

  if (!content) {
    return <p>No hay contenido disponible.</p>;
  }

  // Determine which tab to show by default
  const getDefaultTab = () => {
    if (content?.executiveSummary) return "executiveSummary";
    if (content?.technicalAnalysis) return "technicalAnalysis";
    if (content?.keywords) return "keywords";
    if (content?.contentAnalysis) return "contentAnalysis";
    if (content?.backlinksAnalysis) return "backlinksAnalysis";
    if (content?.localSeo) return "localSeo";
    if (content?.pageSpeedData) return "pageSpeedData";
    if (content?.recommendations) return "recommendations";
    if (content?.serviceProposal) return "serviceProposal";
    return "executiveSummary";
  };

  // Verificamos si hay datos de PageSpeed, ya sea de la base de datos o del contenido del informe
  const hasPageSpeedData = pageSpeedData || content?.pageSpeedData;
  
  // Decidir qué datos usar para PageSpeed, priorizando los datos recién cargados
  const pageSpeedDataToUse = pageSpeedData || content?.pageSpeedData;

  return (
    <Tabs defaultValue={getDefaultTab()} className="w-full">
      {/* Tabs Navigation */}
      <div className="bg-background/80 backdrop-blur-sm sticky top-0 z-10 pb-2">
        <TabsList className="mb-4 flex h-auto p-1 justify-start overflow-x-auto w-full">
          {content?.executiveSummary && (
            <TabsTrigger value="executiveSummary" className="flex items-center gap-1 py-2">
              <FileBarChart className="h-4 w-4" />
              <span>Resumen Ejecutivo</span>
            </TabsTrigger>
          )}
          {content?.technicalAnalysis && (
            <TabsTrigger value="technicalAnalysis" className="flex items-center gap-1 py-2">
              <SearchCode className="h-4 w-4" />
              <span>SEO Técnico</span>
            </TabsTrigger>
          )}
          {content?.keywords && (
            <TabsTrigger value="keywords" className="flex items-center gap-1 py-2">
              <KeyRound className="h-4 w-4" />
              <span>Palabras Clave</span>
            </TabsTrigger>
          )}
          {content?.contentAnalysis && (
            <TabsTrigger value="contentAnalysis" className="flex items-center gap-1 py-2">
              <FileText className="h-4 w-4" />
              <span>Análisis de Contenido</span>
            </TabsTrigger>
          )}
          {content?.backlinksAnalysis && (
            <TabsTrigger value="backlinksAnalysis" className="flex items-center gap-1 py-2">
              <Layers className="h-4 w-4" />
              <span>Backlinks</span>
            </TabsTrigger>
          )}
          {content?.localSeo && (
            <TabsTrigger value="localSeo" className="flex items-center gap-1 py-2">
              <Globe className="h-4 w-4" />
              <span>SEO Local</span>
            </TabsTrigger>
          )}
          {(hasPageSpeedData || isLoadingPageSpeed) && (
            <TabsTrigger value="pageSpeedData" className="flex items-center gap-1 py-2">
              <Gauge className="h-4 w-4" />
              <span>PageSpeed</span>
            </TabsTrigger>
          )}
          {content?.recommendations && (
            <TabsTrigger value="recommendations" className="flex items-center gap-1 py-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Recomendaciones</span>
            </TabsTrigger>
          )}
          {content?.serviceProposal && (
            <TabsTrigger value="serviceProposal" className="flex items-center gap-1 py-2">
              <LightbulbIcon className="h-4 w-4" />
              <span>Propuesta</span>
            </TabsTrigger>
          )}
        </TabsList>
      </div>
      
      <ScrollArea className="h-full pr-4">
        {content?.executiveSummary && (
          <TabsContent value="executiveSummary" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ReportSection 
              title="Resumen Ejecutivo" 
              content={content.executiveSummary} 
              sectionKey="executiveSummary"
              onEdit={() => onEdit("executiveSummary")} 
              isEditing={isEditing} 
            />
          </TabsContent>
        )}
        
        {content?.technicalAnalysis && (
          <TabsContent value="technicalAnalysis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ReportSection 
              title="Análisis Técnico SEO" 
              content={content.technicalAnalysis} 
              sectionKey="technicalAnalysis"
              onEdit={() => onEdit("technicalAnalysis")} 
              isEditing={isEditing} 
            />
          </TabsContent>
        )}
        
        {content?.keywords && (
          <TabsContent value="keywords" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ReportSection 
              title="Palabras Clave" 
              content={content.keywords} 
              sectionKey="keywords"
              onEdit={() => onEdit("keywords")} 
              isEditing={isEditing} 
            />
          </TabsContent>
        )}
        
        {content?.contentAnalysis && (
          <TabsContent value="contentAnalysis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ReportSection 
              title="Análisis de Contenido" 
              content={content.contentAnalysis} 
              sectionKey="contentAnalysis"
              onEdit={() => onEdit("contentAnalysis")} 
              isEditing={isEditing} 
            />
          </TabsContent>
        )}
        
        {content?.backlinksAnalysis && (
          <TabsContent value="backlinksAnalysis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ReportSection 
              title="Análisis de Backlinks" 
              content={content.backlinksAnalysis} 
              sectionKey="backlinksAnalysis"
              onEdit={() => onEdit("backlinksAnalysis")} 
              isEditing={isEditing} 
            />
          </TabsContent>
        )}
        
        {content?.localSeo && (
          <TabsContent value="localSeo" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ReportSection 
              title="SEO Local" 
              content={content.localSeo} 
              sectionKey="localSeo"
              onEdit={() => onEdit("localSeo")} 
              isEditing={isEditing} 
            />
          </TabsContent>
        )}
        
        {(hasPageSpeedData || isLoadingPageSpeed) && (
          <TabsContent value="pageSpeedData" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {isLoadingPageSpeed ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-56" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : pageSpeedDataToUse ? (
              <PageSpeedTab data={pageSpeedDataToUse} />
            ) : (
              <div className="p-8 text-center">
                <p>No hay datos de PageSpeed disponibles para este informe.</p>
              </div>
            )}
          </TabsContent>
        )}
        
        {content?.recommendations && (
          <TabsContent value="recommendations" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ReportSection 
              title="Recomendaciones" 
              content={content.recommendations} 
              sectionKey="recommendations"
              onEdit={() => onEdit("recommendations")} 
              isEditing={isEditing} 
              isRecommendations={true}
            />
          </TabsContent>
        )}
        
        {content?.serviceProposal && (
          <TabsContent value="serviceProposal" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <ReportSection 
              title="Propuesta de Servicios" 
              content={content.serviceProposal} 
              sectionKey="serviceProposal"
              onEdit={() => onEdit("serviceProposal")} 
              isEditing={isEditing} 
            />
          </TabsContent>
        )}
      </ScrollArea>
    </Tabs>
  );
};

export default ReportTabs;
