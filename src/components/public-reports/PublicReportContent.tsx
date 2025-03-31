
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import ReportTabs from './ReportTabs';
import ReportContents from './ReportContents';
import { BusinessProfile } from '@/types/report.types';
import MarkdownContent from '@/components/ui/MarkdownContent';

interface ReportContentType {
  executiveSummary: string;
  technicalAnalysis: string;
  contentAnalysis: string;
  backlinksAnalysis: string;
  recommendations: string;
  localSeo?: string;
  serviceProposal?: string;
  keywords?: string;
  businessProfile?: BusinessProfile;
}

interface PublicReportContentProps {
  report: {
    id?: string;
    title?: string;
    content?: ReportContentType | string;
  };
}

const PublicReportContent: React.FC<PublicReportContentProps> = ({ report }) => {
  // Asegurarnos que el contenido existe, incluso si está vacío
  const content: ReportContentType = typeof report?.content === 'string' 
    ? { 
        executiveSummary: report.content || '',
        technicalAnalysis: '',
        contentAnalysis: '',
        backlinksAnalysis: '',
        recommendations: ''
      }
    : report?.content || {
        executiveSummary: '',
        technicalAnalysis: '',
        contentAnalysis: '',
        backlinksAnalysis: '',
        recommendations: ''
      };
  
  // Verificar si es un informe antiguo donde el contenido es texto simple
  if (typeof report.content === 'string') {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 bg-card border border-border rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">{report.title || "Informe SEO"}</h2>
        <MarkdownContent content={report.content as string} />
      </div>
    );
  }
  
  // Calcular cuántas pestañas mostrar según el contenido disponible
  const hasLocalSeo = content?.localSeo && content.localSeo.trim() !== '';
  const hasProposal = content?.serviceProposal && content.serviceProposal.trim() !== '';
  const hasKeywords = content?.keywords && content.keywords.trim() !== '';
  const hasBusinessProfile = !!content?.businessProfile && !!content.businessProfile.businessUrl;
  
  // Contar pestañas estándar (siempre mostrar estas 5)
  const tabCount = 5 + 
    (hasLocalSeo ? 1 : 0) + 
    (hasProposal ? 1 : 0) + 
    (hasKeywords ? 1 : 0) + 
    (hasBusinessProfile ? 1 : 0);
  
  // Verificar si hay contenido real para mostrar
  const hasContent = 
    (content?.executiveSummary && content.executiveSummary.trim() !== '') ||
    (content?.technicalAnalysis && content.technicalAnalysis.trim() !== '') ||
    (content?.contentAnalysis && content.contentAnalysis.trim() !== '') ||
    (content?.backlinksAnalysis && content.backlinksAnalysis.trim() !== '') ||
    (content?.recommendations && content.recommendations.trim() !== '') ||
    hasLocalSeo || hasProposal || hasKeywords || hasBusinessProfile;
  
  // Si no hay contenido real, mostrar mensaje
  if (!hasContent) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 bg-card border border-border rounded-lg shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Informe sin contenido</h2>
        <p className="text-muted-foreground">
          Este informe existe pero no tiene contenido disponible para mostrar.
        </p>
      </div>
    );
  }
  
  // Mostrar el informe con pestañas
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-primary/5 to-background/50 backdrop-blur-sm p-6 rounded-lg border border-primary/10 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-gradient-primary">Informe SEO Completo</h2>
        <p className="text-center text-muted-foreground">Navega por las diferentes secciones para ver el análisis detallado.</p>
      </div>
      
      <Tabs defaultValue="executive-summary" className="w-full">
        <ReportTabs 
          tabCount={tabCount} 
          hasLocalSeo={hasLocalSeo} 
          hasProposal={hasProposal} 
          hasKeywords={hasKeywords}
          hasBusinessProfile={hasBusinessProfile}
        />
        
        <ReportContents 
          content={content} 
          hasLocalSeo={hasLocalSeo} 
          hasProposal={hasProposal} 
          hasKeywords={hasKeywords}
          hasBusinessProfile={hasBusinessProfile}
        />
      </Tabs>
    </div>
  );
};

export default PublicReportContent;
