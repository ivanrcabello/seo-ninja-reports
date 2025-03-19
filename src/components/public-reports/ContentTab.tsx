
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import ReportSection from '../reports/report-section/ReportSection';
import FormattedContent from '../reports/report-section/FormattedContent';
import RecommendationsList from '../reports/report-section/RecommendationsList';
import BusinessProfileSection from '../reports/report-section/BusinessProfileSection';
import { PageSpeedTab } from '../reports/report-viewer/pagespeed';
import KeywordsSection from '../reports/report-viewer/keywords/KeywordsSection';

interface ContentTabProps {
  tabValue: string;
  content: any;
  keywords?: any[];
}

const ContentTab: React.FC<ContentTabProps> = ({ tabValue, content, keywords = [] }) => {
  const renderContent = () => {
    switch (tabValue) {
      case 'executive-summary':
        return (
          <ReportSection
            title="Resumen Ejecutivo"
            content={content?.executiveSummary || ''}
            isPublic
          />
        );
      case 'technical':
        return (
          <ReportSection
            title="Análisis Técnico SEO"
            content={content?.technicalAnalysis || ''}
            isPublic
          />
        );
      case 'content':
        return (
          <ReportSection
            title="Análisis de Contenido"
            content={content?.contentAnalysis || ''}
            isPublic
          />
        );
      case 'backlinks':
        return (
          <ReportSection
            title="Análisis de Backlinks"
            content={content?.backlinksAnalysis || ''}
            isPublic
          />
        );
      case 'recommendations':
        if (content?.recommendations?.includes('<recommendation>')) {
          return <RecommendationsList content={content.recommendations} isPublic />;
        }
        return (
          <ReportSection
            title="Recomendaciones"
            content={content?.recommendations || ''}
            isPublic
          />
        );
      case 'local-seo':
        return (
          <ReportSection
            title="SEO Local"
            content={content?.localSeo || ''}
            isPublic
          />
        );
      case 'proposal':
        return (
          <ReportSection
            title="Propuesta de Servicios"
            content={content?.serviceProposal || ''}
            isPublic
          />
        );
      case 'keywords':
        return (
          <KeywordsSection
            keywordsContent={content?.keywords || ''}
            keywords={keywords}
            isPublic
          />
        );
      case 'business-profile':
        return (
          content?.businessProfile ? (
            <BusinessProfileSection 
              businessProfile={content.businessProfile as BusinessProfile} 
              view="full" 
            />
          ) : (
            <p className="text-muted-foreground">No hay información de ficha de negocio disponible.</p>
          )
        );
      default:
        return <div>Selecciona una sección para ver su contenido.</div>;
    }
  };

  return (
    <div className="pb-8 pt-4 px-4">
      {renderContent()}
    </div>
  );
};

export default ContentTab;
