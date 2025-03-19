
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Report } from '@/types/report.types';
import ReportSection from '../../report-section';
import { PageSpeedTab } from '../pagespeed';
import { Skeleton } from '@/components/ui/skeleton';

interface TabContentProps {
  report: Report;
  pageSpeedData: any;
  isLoadingPageSpeed: boolean;
  isEditing: boolean;
  onEdit: (sectionKey: string, content: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  report,
  pageSpeedData,
  isLoadingPageSpeed,
  isEditing,
  onEdit
}) => {
  const { content } = report;
  if (!content) return null;

  // Check if we have PageSpeed data from either source
  const hasPageSpeedData = pageSpeedData || content.pageSpeedData;
  
  // Decide which data to use for PageSpeed, prioritizing newly loaded data
  const pageSpeedDataToUse = pageSpeedData || content.pageSpeedData;

  return (
    <ScrollArea className="h-full pr-4">
      {content.executiveSummary && (
        <TabsContent value="executiveSummary" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReportSection 
            title="Resumen Ejecutivo" 
            content={content.executiveSummary} 
            sectionKey="executiveSummary"
            onEdit={onEdit} 
            isEditing={isEditing} 
          />
        </TabsContent>
      )}
      
      {content.technicalAnalysis && (
        <TabsContent value="technicalAnalysis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReportSection 
            title="Análisis Técnico SEO" 
            content={content.technicalAnalysis} 
            sectionKey="technicalAnalysis"
            onEdit={onEdit} 
            isEditing={isEditing} 
          />
        </TabsContent>
      )}
      
      {content.keywords && (
        <TabsContent value="keywords" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReportSection 
            title="Palabras Clave" 
            content={content.keywords} 
            sectionKey="keywords"
            onEdit={onEdit} 
            isEditing={isEditing} 
          />
        </TabsContent>
      )}
      
      {content.contentAnalysis && (
        <TabsContent value="contentAnalysis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReportSection 
            title="Análisis de Contenido" 
            content={content.contentAnalysis} 
            sectionKey="contentAnalysis"
            onEdit={onEdit} 
            isEditing={isEditing} 
          />
        </TabsContent>
      )}
      
      {content.backlinksAnalysis && (
        <TabsContent value="backlinksAnalysis" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReportSection 
            title="Análisis de Backlinks" 
            content={content.backlinksAnalysis} 
            sectionKey="backlinksAnalysis"
            onEdit={onEdit} 
            isEditing={isEditing} 
          />
        </TabsContent>
      )}
      
      {content.localSeo && (
        <TabsContent value="localSeo" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReportSection 
            title="SEO Local" 
            content={content.localSeo} 
            sectionKey="localSeo"
            onEdit={onEdit} 
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
      
      {content.recommendations && (
        <TabsContent value="recommendations" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReportSection 
            title="Recomendaciones" 
            content={content.recommendations} 
            sectionKey="recommendations"
            onEdit={onEdit} 
            isEditing={isEditing} 
            isRecommendations={true}
          />
        </TabsContent>
      )}
      
      {content.serviceProposal && (
        <TabsContent value="serviceProposal" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <ReportSection 
            title="Propuesta de Servicios" 
            content={content.serviceProposal} 
            sectionKey="serviceProposal"
            onEdit={onEdit} 
            isEditing={isEditing} 
          />
        </TabsContent>
      )}
    </ScrollArea>
  );
};

export default TabContent;
