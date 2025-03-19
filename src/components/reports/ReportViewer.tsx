import React from 'react';
import { Report } from '@/types/report.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Share2 } from 'lucide-react';
import { getFilePublicUrl } from '@/services/reportService';

interface ReportViewerProps {
  report: Report | undefined;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
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
          <Button variant="ghost" size="sm" onClick={() => {
            navigator.clipboard.writeText(getPublicShareLink());
            alert('Enlace copiado al portapapeles');
          }}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-auto flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {content?.executiveSummary && (
              <section>
                <h2 className="text-xl font-semibold">Resumen Ejecutivo</h2>
                <p>{content.executiveSummary}</p>
              </section>
            )}

            {content?.technicalAnalysis && (
              <section>
                <h2 className="text-xl font-semibold">Análisis Técnico</h2>
                <p>{content.technicalAnalysis}</p>
              </section>
            )}

            {content?.contentAnalysis && (
              <section>
                <h2 className="text-xl font-semibold">Análisis de Contenido</h2>
                <p>{content.contentAnalysis}</p>
              </section>
            )}

            {content?.backlinksAnalysis && (
              <section>
                <h2 className="text-xl font-semibold">Análisis de Backlinks</h2>
                <p>{content.backlinksAnalysis}</p>
              </section>
            )}
            
            {content?.keywords && (
              <section>
                <h2 className="text-xl font-semibold">Palabras Clave</h2>
                <p>{content.keywords}</p>
              </section>
            )}

            {content?.localSeo && (
              <section>
                <h2 className="text-xl font-semibold">SEO Local</h2>
                <p>{content.localSeo}</p>
              </section>
            )}

            {content?.recommendations && (
              <section>
                <h2 className="text-xl font-semibold">Recomendaciones</h2>
                <p>{content.recommendations}</p>
              </section>
            )}

            {content?.serviceProposal && (
              <section>
                <h2 className="text-xl font-semibold">Propuesta de Servicios</h2>
                <p>{content.serviceProposal}</p>
              </section>
            )}
            
            {content?.pageSpeedData && (
              <section>
                <h2 className="text-xl font-semibold">Datos de PageSpeed Insights</h2>
                
                <h3 className="text-lg font-semibold">Escritorio</h3>
                <p>Rendimiento: {content.pageSpeedData.desktop.performance}</p>
                <p>Accesibilidad: {content.pageSpeedData.desktop.accessibility}</p>
                <p>Mejores Prácticas: {content.pageSpeedData.desktop.bestPractices}</p>
                <p>SEO: {content.pageSpeedData.desktop.seo}</p>
                
                <h3 className="text-lg font-semibold">Móvil</h3>
                <p>Rendimiento: {content.pageSpeedData.mobile.performance}</p>
                <p>Accesibilidad: {content.pageSpeedData.mobile.accessibility}</p>
                <p>Mejores Prácticas: {content.pageSpeedData.mobile.bestPractices}</p>
                <p>SEO: {content.pageSpeedData.mobile.seo}</p>
              </section>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
