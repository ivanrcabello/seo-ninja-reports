
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { BusinessProfile } from '@/types/report.types';
import ReportSection from '../reports/report-section/ReportSection';
import FormattedContent from '../reports/report-section/FormattedContent';
import RecommendationsList from '../reports/report-section/RecommendationsList';
import BusinessProfileSection from '../reports/report-section/BusinessProfileSection';
import KeywordsSection from '../reports/report-viewer/keywords/KeywordsSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowRight, CheckCircle } from 'lucide-react';

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
  keywords?: any[];
}

const ContentTab: React.FC<ContentTabProps> = ({ tabValue, content, keywords = [] }) => {
  
  const getTabContent = () => {
    switch (tabValue) {
      case 'executive-summary':
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                  Resumen
                </Badge>
                Resumen Ejecutivo
              </h2>
              <FormattedContent content={content?.executiveSummary || ''} />
            </CardContent>
          </Card>
        );
      
      case 'technical':
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-500">
                  Técnico
                </Badge>
                Análisis Técnico SEO
              </h2>
              <FormattedContent content={content?.technicalAnalysis || ''} />
            </CardContent>
          </Card>
        );
      
      case 'content':
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500">
                  Contenido
                </Badge>
                Análisis de Contenido
              </h2>
              <FormattedContent content={content?.contentAnalysis || ''} />
            </CardContent>
          </Card>
        );
      
      case 'backlinks':
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-500">
                  Backlinks
                </Badge>
                Análisis de Backlinks
              </h2>
              <FormattedContent content={content?.backlinksAnalysis || ''} />
            </CardContent>
          </Card>
        );
      
      case 'recommendations':
        if (content?.recommendations?.includes('<recommendation>')) {
          return (
            <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-yellow-500 flex items-center gap-2">
                  <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
                    Importante
                  </Badge>
                  Recomendaciones
                </h2>
                <RecommendationsList content={content.recommendations} isPublic={true} />
              </CardContent>
            </Card>
          );
        }
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500 flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
                  Importante
                </Badge>
                Recomendaciones
              </h2>
              <FormattedContent content={content?.recommendations || ''} />
            </CardContent>
          </Card>
        );
      
      case 'local-seo':
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-500">
                  Local
                </Badge>
                SEO Local
              </h2>
              <FormattedContent content={content?.localSeo || ''} />
            </CardContent>
          </Card>
        );
      
      case 'proposal':
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-500/10 border-orange-500/20 text-orange-500">
                  Propuesta
                </Badge>
                Propuesta de Servicios
              </h2>
              <FormattedContent content={content?.serviceProposal || ''} />
            </CardContent>
          </Card>
        );
      
      case 'keywords':
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                  Keywords
                </Badge>
                Palabras Clave
              </h2>
              <KeywordsSection
                keywordsContent={content?.keywords || ''}
                keywords={keywords}
                isPublic={true}
              />
            </CardContent>
          </Card>
        );
      
      case 'business-profile':
        return (
          <Card className="bg-gradient-to-br from-background/90 via-background/80 to-background/70 shadow-md border-primary/10 backdrop-blur-md">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-500">
                  Google
                </Badge>
                Ficha de Negocio
              </h2>
              {content?.businessProfile ? (
                <BusinessProfileSection 
                  businessProfile={content.businessProfile} 
                  view="full" 
                />
              ) : (
                <p className="text-muted-foreground">No hay información de ficha de negocio disponible.</p>
              )}
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Selecciona una sección para ver su contenido.</p>
          </div>
        );
    }
  };

  return (
    <TabsContent value={tabValue} className="focus-visible:outline-none animate-fade-in">
      <div className="py-6">
        {getTabContent()}
      </div>
    </TabsContent>
  );
};

export default ContentTab;
