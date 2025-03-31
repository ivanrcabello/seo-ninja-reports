
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PublicReportContent, PublicReportEmpty, PublicReportError, PublicReportHeader, PublicReportLoading } from '@/components/public-reports';
import useReportData from '@/components/public-reports/useReportData';
import { logSharedReportAccess } from '@/utils/sharedContentLogger';
import { toast } from 'sonner';

const PublicReport: React.FC = () => {
  const navigate = useNavigate();
  const { reportId = '' } = useParams<{ reportId: string }>();
  const [loadRetries, setLoadRetries] = useState(0);
  
  console.log('PublicReport page loaded with reportId:', reportId);
  
  const { 
    report, 
    isLoading, 
    error, 
    refetch,
    notFound
  } = useReportData(reportId);

  // Registrar visualización de página
  useEffect(() => {
    if (reportId) {
      console.log(`PublicReport page initialized with reportId: ${reportId}`);
      logSharedReportAccess(reportId, { 
        successful: true,
        action: 'page_view' 
      }, 'page_view');
    }
  }, [reportId]);
  
  // Función para reintentar carga de datos
  const handleRetry = () => {
    console.log('Retrying report fetch manually');
    setLoadRetries(prev => prev + 1);
    refetch();
    toast.info('Reintentando cargar el informe...');
  };

  // Mostrar estado de carga
  if (isLoading) {
    console.log('PublicReport: Showing loading state');
    return <PublicReportLoading timeout={10000} onRetry={handleRetry} />;
  }

  // Mostrar estado de error
  if (error) {
    console.error('PublicReport: Error loading report:', error);
    return (
      <PublicReportError 
        errorMessage={error} 
        onRetry={handleRetry} 
        retryCount={loadRetries}
      />
    );
  }

  // Mostrar estado de no encontrado
  if (notFound) {
    console.log('PublicReport: Report not found, showing empty state');
    return <PublicReportEmpty onBack={() => navigate('/')} onRetry={handleRetry} />;
  }

  // Mostrar estado vacío si no hay informe
  if (!report) {
    console.log('PublicReport: No report found, showing empty state');
    return <PublicReportEmpty onBack={() => navigate('/')} onRetry={handleRetry} />;
  }

  console.log('PublicReport: Rendering report content:', report);
  
  // Mostrar contenido del informe
  return (
    <div className="min-h-screen bg-background">
      <PublicReportHeader 
        title={report.title || "Informe SEO"} 
        client={report.client_name}
        website={report.client_website}
        date={report.date}
      />
      
      <div className="container mx-auto py-8">
        <PublicReportContent report={report} />
      </div>
    </div>
  );
};

export default PublicReport;
