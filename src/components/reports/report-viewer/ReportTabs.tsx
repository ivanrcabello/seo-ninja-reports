
import React from 'react';
import { Report } from '@/types/report.types';
import { ScrollArea } from "@/components/ui/scroll-area";
import ReportSection from '../report-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageSpeedTab from './PageSpeedTab';

interface ReportTabsProps {
  report: Report;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ report }) => {
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

  return (
    <Tabs defaultValue={getDefaultTab()} className="w-full">
      <TabsList className="mb-4 flex justify-start overflow-x-auto pb-px w-full">
        {content?.executiveSummary && (
          <TabsTrigger value="executiveSummary">Resumen Ejecutivo</TabsTrigger>
        )}
        {content?.technicalAnalysis && (
          <TabsTrigger value="technicalAnalysis">SEO Técnico</TabsTrigger>
        )}
        {content?.keywords && (
          <TabsTrigger value="keywords">Palabras Clave</TabsTrigger>
        )}
        {content?.contentAnalysis && (
          <TabsTrigger value="contentAnalysis">Análisis de Contenido</TabsTrigger>
        )}
        {content?.backlinksAnalysis && (
          <TabsTrigger value="backlinksAnalysis">Backlinks</TabsTrigger>
        )}
        {content?.localSeo && (
          <TabsTrigger value="localSeo">SEO Local</TabsTrigger>
        )}
        {content?.pageSpeedData && (
          <TabsTrigger value="pageSpeedData">PageSpeed</TabsTrigger>
        )}
        {content?.recommendations && (
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        )}
        {content?.serviceProposal && (
          <TabsTrigger value="serviceProposal">Propuesta</TabsTrigger>
        )}
      </TabsList>
      
      <ScrollArea className="h-full">
        {content?.executiveSummary && (
          <TabsContent value="executiveSummary">
            <ReportSection 
              title="Resumen Ejecutivo" 
              content={content.executiveSummary} 
              sectionKey="executiveSummary"
              onEdit={() => {}} 
              isEditing={false} 
            />
          </TabsContent>
        )}
        
        {content?.technicalAnalysis && (
          <TabsContent value="technicalAnalysis">
            <ReportSection 
              title="Análisis Técnico SEO" 
              content={content.technicalAnalysis} 
              sectionKey="technicalAnalysis"
              onEdit={() => {}} 
              isEditing={false} 
            />
          </TabsContent>
        )}
        
        {content?.keywords && (
          <TabsContent value="keywords">
            <ReportSection 
              title="Palabras Clave" 
              content={content.keywords} 
              sectionKey="keywords"
              onEdit={() => {}} 
              isEditing={false} 
            />
          </TabsContent>
        )}
        
        {content?.contentAnalysis && (
          <TabsContent value="contentAnalysis">
            <ReportSection 
              title="Análisis de Contenido" 
              content={content.contentAnalysis} 
              sectionKey="contentAnalysis"
              onEdit={() => {}} 
              isEditing={false} 
            />
          </TabsContent>
        )}
        
        {content?.backlinksAnalysis && (
          <TabsContent value="backlinksAnalysis">
            <ReportSection 
              title="Análisis de Backlinks" 
              content={content.backlinksAnalysis} 
              sectionKey="backlinksAnalysis"
              onEdit={() => {}} 
              isEditing={false} 
            />
          </TabsContent>
        )}
        
        {content?.localSeo && (
          <TabsContent value="localSeo">
            <ReportSection 
              title="SEO Local" 
              content={content.localSeo} 
              sectionKey="localSeo"
              onEdit={() => {}} 
              isEditing={false} 
            />
          </TabsContent>
        )}
        
        {content?.pageSpeedData && (
          <TabsContent value="pageSpeedData">
            <PageSpeedTab data={content.pageSpeedData} />
          </TabsContent>
        )}
        
        {content?.recommendations && (
          <TabsContent value="recommendations">
            <ReportSection 
              title="Recomendaciones" 
              content={content.recommendations} 
              sectionKey="recommendations"
              onEdit={() => {}} 
              isEditing={false} 
              isRecommendations={true}
            />
          </TabsContent>
        )}
        
        {content?.serviceProposal && (
          <TabsContent value="serviceProposal">
            <ReportSection 
              title="Propuesta de Servicios" 
              content={content.serviceProposal} 
              sectionKey="serviceProposal"
              onEdit={() => {}} 
              isEditing={false} 
            />
          </TabsContent>
        )}
      </ScrollArea>
    </Tabs>
  );
};

export default ReportTabs;
