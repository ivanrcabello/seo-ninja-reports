
import React from 'react';
import ContentTab from './ContentTab';
import { Info, CheckCircle, ArrowUp, ArrowDown, AlertTriangle, MapPin, Star, FileText } from 'lucide-react';

interface ReportContentsProps {
  content: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    recommendations: string;
    localSeo?: string;
    serviceProposal?: string;
    keywords?: string;
  };
  hasLocalSeo: boolean;
  hasProposal: boolean;
  hasKeywords: boolean;
}

const ReportContents: React.FC<ReportContentsProps> = ({ 
  content, 
  hasLocalSeo, 
  hasProposal, 
  hasKeywords 
}) => {
  return (
    <>
      <ContentTab 
        value="executive-summary" 
        title="Resumen Ejecutivo" 
        content={content.executiveSummary} 
        icon={Info} 
        iconColor="text-blue-500" 
      />
      
      <ContentTab 
        value="technical" 
        title="Análisis Técnico" 
        content={content.technicalAnalysis} 
        icon={CheckCircle} 
        iconColor="text-green-500" 
      />
      
      <ContentTab 
        value="content" 
        title="Análisis de Contenido" 
        content={content.contentAnalysis} 
        icon={ArrowUp} 
        iconColor="text-purple-500" 
      />
      
      <ContentTab 
        value="backlinks" 
        title="Análisis de Backlinks y Autoridad" 
        content={content.backlinksAnalysis} 
        icon={ArrowDown} 
        iconColor="text-amber-500" 
      />
      
      <ContentTab 
        value="recommendations" 
        title="Recomendaciones y Acciones" 
        content={content.recommendations} 
        icon={AlertTriangle} 
        iconColor="text-red-500" 
        isRecommendations={true}
      />
      
      {hasLocalSeo && (
        <ContentTab 
          value="local-seo" 
          title="SEO Local" 
          content={content.localSeo || ''} 
          icon={MapPin} 
          iconColor="text-indigo-500" 
        />
      )}
      
      {hasProposal && (
        <ContentTab 
          value="proposal" 
          title="Propuesta de Servicios" 
          content={content.serviceProposal || ''} 
          icon={Star} 
          iconColor="text-yellow-500" 
        />
      )}
      
      {hasKeywords && (
        <ContentTab 
          value="keywords" 
          title="Palabras Clave" 
          content={content.keywords || ''} 
          icon={FileText} 
          iconColor="text-teal-500" 
        />
      )}
    </>
  );
};

export default ReportContents;
