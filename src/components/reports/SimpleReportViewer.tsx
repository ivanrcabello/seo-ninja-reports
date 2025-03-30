
import React, { useState, useEffect } from 'react';
import { Report } from '@/types/report.types';
import { useParams } from 'react-router-dom';
import useReports from '@/hooks/useReports';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleReportViewerProps {
  reportId?: string;
  report?: Report;
}

const SimpleReportViewer: React.FC<SimpleReportViewerProps> = ({ reportId, report: providedReport }) => {
  const { id } = useParams();
  const { getReport } = useReports();
  const [loadedReport, setLoadedReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine which report ID to use
  const effectiveId = reportId || id;
  
  // Log initial props
  console.log('SimpleReportViewer initial props:', { 
    providedReport: !!providedReport, 
    reportId, 
    urlId: id 
  });
  
  useEffect(() => {
    // If we already have a report provided directly, use that
    if (providedReport) {
      console.log('Using provided report:', providedReport.id);
      setLoadedReport(providedReport);
      return;
    }
    
    // If we have an ID but no provided report, fetch it
    if (effectiveId) {
      setIsLoading(true);
      console.log('Attempting to fetch report with ID:', effectiveId);
      const fetchedReport = getReport(effectiveId);
      
      if (fetchedReport) {
        console.log('Found report:', fetchedReport.id);
        console.log('Report content exists:', !!fetchedReport.content);
        setLoadedReport(fetchedReport);
      } else {
        console.error('Report not found with ID:', effectiveId);
        toast.error('No se encontró el informe');
      }
      
      setIsLoading(false);
    }
  }, [providedReport, effectiveId, getReport]);
  
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const reportToDisplay = loadedReport || providedReport;
  
  if (!reportToDisplay) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-2xl font-bold text-center text-red-500">Informe no encontrado</h2>
        <p className="text-center text-muted-foreground mt-4">
          No se pudo cargar el informe solicitado (ID: {effectiveId || 'no ID'})
        </p>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Compruebe que el informe existe y vuelva a intentarlo.
        </p>
      </div>
    );
  }
  
  if (reportToDisplay.status === 'processing') {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-bold text-center">Generando informe</h2>
        <div className="flex justify-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
        <p className="text-center text-muted-foreground mt-4">
          El informe está siendo generado. Por favor, espere unos momentos.
        </p>
      </div>
    );
  }
  
  if (reportToDisplay.status === 'failed') {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-bold text-center text-red-500">Error al generar el informe</h2>
        <p className="text-center mt-4">
          {reportToDisplay.summary || 'No se pudo completar la generación del informe.'}
        </p>
      </div>
    );
  }
  
  if (!reportToDisplay.content) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg">
        <h2 className="text-xl font-bold text-center text-red-500">Informe sin contenido</h2>
        <p className="text-center text-muted-foreground mt-4">
          El informe existe pero no contiene datos.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card border border-border rounded-lg">
      <h2 className="text-2xl font-bold mb-6">{reportToDisplay.title}</h2>
      
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <h3>Resumen Ejecutivo</h3>
        <div dangerouslySetInnerHTML={{ __html: reportToDisplay.content.executiveSummary.replace(/\n/g, '<br />') }} />
        
        <h3 className="mt-8">Análisis Técnico</h3>
        <div dangerouslySetInnerHTML={{ __html: reportToDisplay.content.technicalAnalysis.replace(/\n/g, '<br />') }} />
        
        <h3 className="mt-8">Análisis de Contenido</h3>
        <div dangerouslySetInnerHTML={{ __html: reportToDisplay.content.contentAnalysis.replace(/\n/g, '<br />') }} />
        
        <h3 className="mt-8">Análisis de Backlinks</h3>
        <div dangerouslySetInnerHTML={{ __html: reportToDisplay.content.backlinksAnalysis.replace(/\n/g, '<br />') }} />
        
        <h3 className="mt-8">Recomendaciones</h3>
        <div dangerouslySetInnerHTML={{ __html: reportToDisplay.content.recommendations.replace(/\n/g, '<br />') }} />
        
        {reportToDisplay.content.localSeo && (
          <>
            <h3 className="mt-8">SEO Local</h3>
            <div dangerouslySetInnerHTML={{ __html: reportToDisplay.content.localSeo.replace(/\n/g, '<br />') }} />
          </>
        )}
        
        {reportToDisplay.content.serviceProposal && (
          <>
            <h3 className="mt-8">Propuesta de Servicios</h3>
            <div dangerouslySetInnerHTML={{ __html: reportToDisplay.content.serviceProposal.replace(/\n/g, '<br />') }} />
          </>
        )}
        
        {reportToDisplay.content.keywords && (
          <>
            <h3 className="mt-8">Palabras Clave</h3>
            <div dangerouslySetInnerHTML={{ __html: reportToDisplay.content.keywords.replace(/\n/g, '<br />') }} />
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleReportViewer;
