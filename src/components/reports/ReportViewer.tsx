
import React from 'react';
import { Report } from '@/types/report.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Share2 } from 'lucide-react';
import { getFilePublicUrl } from '@/services/reportService';
import ReportSection from './report-section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

interface ReportViewerProps {
  report: Report | undefined;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const { toast } = useToast();
  
  if (!report) {
    return <p>Informe no encontrado.</p>;
  }

  const { content } = report;

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPublicShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/shared/reports/${report.id}`;
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(getPublicShareLink());
    toast({
      title: "Enlace copiado",
      description: "El enlace de compartir ha sido copiado al portapapeles",
    });
  };

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
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {report.title}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge className={getBadgeColor(report.status)}>
            {report.status}
          </Badge>
          <Link to={`/reports/${report.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleShareClick}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto flex-1">
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
                <section>
                  <h2 className="text-xl font-semibold mb-4">Datos de PageSpeed</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card p-4 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-3">Escritorio</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Rendimiento:</span>
                          <span className="font-medium">{content.pageSpeedData.desktop.performance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accesibilidad:</span>
                          <span className="font-medium">{content.pageSpeedData.desktop.accessibility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mejores Prácticas:</span>
                          <span className="font-medium">{content.pageSpeedData.desktop.bestPractices}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SEO:</span>
                          <span className="font-medium">{content.pageSpeedData.desktop.seo}</span>
                        </div>
                        {content.pageSpeedData.desktop.firstContentfulPaint && (
                          <div className="flex justify-between">
                            <span>First Contentful Paint:</span>
                            <span className="font-medium">{content.pageSpeedData.desktop.firstContentfulPaint}s</span>
                          </div>
                        )}
                        {content.pageSpeedData.desktop.speedIndex && (
                          <div className="flex justify-between">
                            <span>Speed Index:</span>
                            <span className="font-medium">{content.pageSpeedData.desktop.speedIndex}s</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-3">Móvil</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Rendimiento:</span>
                          <span className="font-medium">{content.pageSpeedData.mobile.performance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accesibilidad:</span>
                          <span className="font-medium">{content.pageSpeedData.mobile.accessibility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mejores Prácticas:</span>
                          <span className="font-medium">{content.pageSpeedData.mobile.bestPractices}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SEO:</span>
                          <span className="font-medium">{content.pageSpeedData.mobile.seo}</span>
                        </div>
                        {content.pageSpeedData.mobile.firstContentfulPaint && (
                          <div className="flex justify-between">
                            <span>First Contentful Paint:</span>
                            <span className="font-medium">{content.pageSpeedData.mobile.firstContentfulPaint}s</span>
                          </div>
                        )}
                        {content.pageSpeedData.mobile.speedIndex && (
                          <div className="flex justify-between">
                            <span>Speed Index:</span>
                            <span className="font-medium">{content.pageSpeedData.mobile.speedIndex}s</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
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
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
