
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessProfile } from '@/types/report.types';

interface Keyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
}

interface ContentTabProps {
  tabValue: string;
  content: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    recommendations: string;
    localSeo?: string;
    serviceProposal?: string;
    keywords?: string;
    businessProfile?: BusinessProfile;
  };
  keywords: Keyword[];
}

const ContentTab: React.FC<ContentTabProps> = ({ tabValue, content, keywords }) => {
  // Helper function to get title based on tab value
  const getTitle = () => {
    switch (tabValue) {
      case 'executive-summary': return 'Resumen Ejecutivo';
      case 'technical': return 'Análisis Técnico SEO';
      case 'content': return 'Análisis de Contenido';
      case 'backlinks': return 'Análisis de Backlinks';
      case 'recommendations': return 'Recomendaciones';
      case 'local-seo': return 'SEO Local';
      case 'proposal': return 'Propuesta de Servicios';
      case 'keywords': return 'Palabras Clave';
      case 'business-profile': return 'Perfil de Negocio';
      default: return '';
    }
  };
  
  // Helper function to get content based on tab value
  const getContent = () => {
    switch (tabValue) {
      case 'executive-summary': return content.executiveSummary;
      case 'technical': return content.technicalAnalysis;
      case 'content': return content.contentAnalysis;
      case 'backlinks': return content.backlinksAnalysis;
      case 'recommendations': return content.recommendations;
      case 'local-seo': return content.localSeo || '';
      case 'proposal': return content.serviceProposal || '';
      case 'keywords': return content.keywords || '';
      default: return '';
    }
  };
  
  // Special rendering for keywords tab
  if (tabValue === 'keywords' && keywords.length > 0) {
    return (
      <TabsContent value={tabValue}>
        <Card>
          <CardHeader>
            <CardTitle>{getTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="mb-6">
                Estas son las palabras clave objetivo analizadas para este sitio web:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Palabra clave</th>
                      <th className="text-right py-2 px-4">Volumen</th>
                      <th className="text-right py-2 px-4">Dificultad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-4">{kw.keyword}</td>
                        <td className="text-right py-2 px-4">{kw.searchVolume || '-'}</td>
                        <td className="text-right py-2 px-4">
                          {kw.difficulty !== undefined ? `${kw.difficulty}/100` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6" dangerouslySetInnerHTML={{ __html: content.keywords || '' }} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }
  
  // Special rendering for business profile tab
  if (tabValue === 'business-profile' && content.businessProfile) {
    const bp = content.businessProfile;
    return (
      <TabsContent value={tabValue}>
        <Card>
          <CardHeader>
            <CardTitle>{getTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div className="bg-muted p-4 rounded-md mb-6">
                <h3 className="text-lg font-semibold mb-2">{bp.businessName || 'Negocio'}</h3>
                {bp.businessAddress && <p className="text-sm mb-1">📍 {bp.businessAddress}</p>}
                {bp.businessPhone && <p className="text-sm mb-1">📞 {bp.businessPhone}</p>}
                {bp.businessCategory && <p className="text-sm mb-1">🏷️ {bp.businessCategory}</p>}
                {bp.businessRating !== undefined && bp.businessRating !== null && (
                  <p className="text-sm mb-1">
                    ⭐ {bp.businessRating.toFixed(1)}/5 ({bp.businessReviewsCount || 0} reseñas)
                  </p>
                )}
                {bp.businessWebsite && (
                  <p className="text-sm mb-1">
                    🌐 <a href={bp.businessWebsite} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline">{bp.businessWebsite}</a>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  }
  
  // Default rendering for most tabs
  return (
    <TabsContent value={tabValue}>
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: getContent() }}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default ContentTab;
