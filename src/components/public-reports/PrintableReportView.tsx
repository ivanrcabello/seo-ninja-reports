
import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useReportData from './useReportData';
import { PublicReportLoading } from '.';

const PrintableReportView: React.FC = () => {
  const { reportId = '' } = useParams<{ reportId: string }>();
  const [searchParams] = useSearchParams();
  const isPrint = searchParams.get('print') === 'true';
  const isPdf = searchParams.get('pdf') === 'true';
  
  const { report, isLoading, error } = useReportData(reportId);
  
  useEffect(() => {
    // Si estamos en modo impresión/PDF, iniciar la impresión automáticamente
    // después de que el contenido se haya cargado completamente
    if (!isLoading && !error && report && isPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, error, report, isPrint]);
  
  // Estilo específico para vista de impresión
  useEffect(() => {
    if (isPrint) {
      // Agregar clase al body para estilos de impresión
      document.body.classList.add('print-view');
      
      return () => {
        document.body.classList.remove('print-view');
      };
    }
  }, [isPrint]);
  
  if (isLoading) {
    return <PublicReportLoading />;
  }
  
  if (error || !report) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Error al cargar el informe</h2>
        <p className="text-red-600">{error || 'No se encontró el informe'}</p>
      </div>
    );
  }
  
  return (
    <div className={`container mx-auto py-8 ${isPrint ? 'print-container' : ''}`}>
      {/* Cabecera del informe */}
      <div className="mb-8 page-break-after-avoid">
        <h1 className="text-3xl font-bold mb-2">{report.title || 'Informe SEO'}</h1>
        
        {report.client_name && (
          <p className="text-lg mb-1">
            <strong>Cliente:</strong> {report.client_name}
          </p>
        )}
        
        {report.client_website && (
          <p className="text-lg mb-1">
            <strong>Sitio web:</strong> {report.client_website}
          </p>
        )}
        
        {report.date && (
          <p className="text-lg mb-4">
            <strong>Fecha:</strong> {new Date(report.date).toLocaleDateString()}
          </p>
        )}
      </div>
      
      {/* Contenido del informe */}
      <div className="space-y-8">
        {report.content?.executiveSummary && (
          <section className="page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4">Resumen Ejecutivo</h2>
            <div className="prose max-w-none">
              {report.content.executiveSummary.split('##').map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(block) }} />
              ))}
            </div>
          </section>
        )}
        
        {report.content?.technicalAnalysis && (
          <section className="page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4">Análisis Técnico SEO</h2>
            <div className="prose max-w-none">
              {report.content.technicalAnalysis.split('##').map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(block) }} />
              ))}
            </div>
          </section>
        )}
        
        {report.content?.contentAnalysis && (
          <section className="page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4">Análisis de Contenido</h2>
            <div className="prose max-w-none">
              {report.content.contentAnalysis.split('##').map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(block) }} />
              ))}
            </div>
          </section>
        )}
        
        {report.content?.backlinksAnalysis && (
          <section className="page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4">Análisis de Backlinks</h2>
            <div className="prose max-w-none">
              {report.content.backlinksAnalysis.split('##').map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(block) }} />
              ))}
            </div>
          </section>
        )}
        
        {report.content?.recommendations && (
          <section className="page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4">Recomendaciones</h2>
            <div className="prose max-w-none">
              {report.content.recommendations.split('##').map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(block) }} />
              ))}
            </div>
          </section>
        )}
        
        {report.content?.localSeo && (
          <section className="page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4">SEO Local</h2>
            <div className="prose max-w-none">
              {report.content.localSeo.split('##').map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(block) }} />
              ))}
            </div>
          </section>
        )}
        
        {report.content?.serviceProposal && (
          <section className="page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4">Propuesta de Servicios</h2>
            <div className="prose max-w-none">
              {report.content.serviceProposal.split('##').map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(block) }} />
              ))}
            </div>
          </section>
        )}
        
        {report.content?.keywords && (
          <section className="page-break-inside-avoid">
            <h2 className="text-2xl font-bold mb-4">Palabras Clave</h2>
            <div className="prose max-w-none">
              {report.content.keywords.split('##').map((block, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: formatMarkdown(block) }} />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Pie de página */}
      <div className="mt-12 pt-4 border-t text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} - Informe generado automáticamente</p>
      </div>
    </div>
  );
};

// Convertir texto markdown a HTML básico
function formatMarkdown(text: string): string {
  if (!text) return '';
  
  // Formateos básicos para texto markdown
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrita
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Cursiva
    .replace(/\n\n/g, '<br/><br/>') // Saltos de línea
    .replace(/^- (.*)/gm, '<li>$1</li>') // Listas
    .replace(/<li>/g, '<ul><li>').replace(/<\/li>(?![\s\S]*<li>)/g, '</li></ul>'); // Cerrar listas
}

export default PrintableReportView;
