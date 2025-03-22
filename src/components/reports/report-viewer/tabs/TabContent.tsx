
import React from 'react';
import { Report, BusinessProfile } from '@/types/report.types';
import { TabsContent } from "@/components/ui/tabs";
import ReportSection from '../../report-section/ReportSection';
import RecommendationsList from '../../report-section/RecommendationsList';
import BusinessProfileSection from '../../report-section/BusinessProfileSection';
import { PageSpeedTab } from '../pagespeed';
import KeywordsSection from '../keywords/KeywordsSection';
import { getKeywords } from '@/services/api/keywordsService';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface TabContentProps {
  report: Report;
  pageSpeedData?: any;
  businessProfile?: BusinessProfile | null;
  isLoadingPageSpeed?: boolean;
  isLoadingBusinessProfile?: boolean;
  isEditing?: boolean;
  onEdit?: (sectionKey: string, content: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({ 
  report, 
  pageSpeedData,
  businessProfile,
  isLoadingPageSpeed = false,
  isLoadingBusinessProfile = false,
  isEditing = false,
  onEdit = () => {}
}) => {
  const { content } = report;
  
  // Query to fetch keywords for the report
  const { data: keywords, isLoading: isLoadingKeywords } = useQuery({
    queryKey: ['keywords', report.id],
    queryFn: () => getKeywords(report.id),
    enabled: !!report.id,
  });
  
  if (!content) {
    console.error('Report content is missing:', report);
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 font-medium mb-2">El informe no tiene contenido disponible</p>
        <p className="text-muted-foreground text-sm">Hay un problema con la generación del informe. Por favor, intenta generarlo nuevamente.</p>
      </div>
    );
  }
  
  console.log('TabContent rendering with content:', content);
  
  // Use pageSpeed data from the passed props or from the report content
  const pageSpeedDataToUse = pageSpeedData || content?.pageSpeedData;
  
  // Use business profile data from the passed props or from the report content
  const businessProfileToUse = businessProfile || content?.businessProfile;
  
  return (
    <div className="p-4 mt-4">
      {/* Executive Summary Tab */}
      <TabsContent value="executiveSummary" className="focus-visible:outline-none">
        <ReportSection 
          title="Resumen Ejecutivo" 
          content={content.executiveSummary} 
          sectionKey="executiveSummary"
          isEditing={isEditing}
          onEdit={onEdit}
        />
      </TabsContent>
      
      {/* Technical Analysis Tab */}
      <TabsContent value="technicalAnalysis" className="focus-visible:outline-none">
        <ReportSection 
          title="Análisis Técnico SEO" 
          content={content.technicalAnalysis} 
          sectionKey="technicalAnalysis"
          isEditing={isEditing}
          onEdit={onEdit}
        />
      </TabsContent>
      
      {/* Keywords Tab */}
      <TabsContent value="keywords" className="focus-visible:outline-none">
        {isLoadingKeywords ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <KeywordsSection 
            keywordsContent={content.keywords || ''} 
            keywords={keywords || []}
            reportId={report.id}
            isEditing={isEditing}
            onEdit={(newContent) => onEdit('keywords', newContent)}
          />
        )}
      </TabsContent>
      
      {/* Content Analysis Tab */}
      <TabsContent value="contentAnalysis" className="focus-visible:outline-none">
        <ReportSection 
          title="Análisis de Contenido" 
          content={content.contentAnalysis} 
          sectionKey="contentAnalysis"
          isEditing={isEditing}
          onEdit={onEdit}
        />
      </TabsContent>
      
      {/* Backlinks Analysis Tab */}
      <TabsContent value="backlinksAnalysis" className="focus-visible:outline-none">
        <ReportSection 
          title="Análisis de Backlinks" 
          content={content.backlinksAnalysis} 
          sectionKey="backlinksAnalysis"
          isEditing={isEditing}
          onEdit={onEdit}
        />
      </TabsContent>
      
      {/* Local SEO Tab */}
      <TabsContent value="localSeo" className="focus-visible:outline-none">
        <ReportSection 
          title="SEO Local" 
          content={content.localSeo || ''} 
          sectionKey="localSeo"
          isEditing={isEditing}
          onEdit={onEdit}
        />
      </TabsContent>
      
      {/* Business Profile Tab */}
      <TabsContent value="businessProfile" className="focus-visible:outline-none">
        {isLoadingBusinessProfile ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : businessProfileToUse ? (
          <BusinessProfileSection businessProfile={businessProfileToUse} />
        ) : (
          <p className="text-muted-foreground">No hay información de ficha de negocio disponible.</p>
        )}
      </TabsContent>
      
      {/* PageSpeed Tab */}
      <TabsContent value="pageSpeedData" className="focus-visible:outline-none">
        {isLoadingPageSpeed ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <PageSpeedTab data={pageSpeedDataToUse} isLoading={isLoadingPageSpeed} />
        )}
      </TabsContent>
      
      {/* Recommendations Tab */}
      <TabsContent value="recommendations" className="focus-visible:outline-none">
        {content.recommendations?.includes('<recommendation>') ? (
          <RecommendationsList 
            content={content.recommendations} 
            isEditing={isEditing}
            onEdit={(newContent) => onEdit('recommendations', newContent)}
          />
        ) : (
          <ReportSection 
            title="Recomendaciones" 
            content={content.recommendations} 
            sectionKey="recommendations"
            isEditing={isEditing}
            onEdit={onEdit}
          />
        )}
      </TabsContent>
      
      {/* Service Proposal Tab */}
      <TabsContent value="serviceProposal" className="focus-visible:outline-none">
        <ReportSection 
          title="Propuesta de Servicios" 
          content={content.serviceProposal || ''} 
          sectionKey="serviceProposal"
          isEditing={isEditing}
          onEdit={onEdit}
        />
      </TabsContent>
    </div>
  );
};

export default TabContent;
