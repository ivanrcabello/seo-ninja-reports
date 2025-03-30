
import React, { useState, useEffect } from 'react';
import { Report } from '@/types/report.types';
import { useParams } from 'react-router-dom';
import useReports from '@/hooks/useReports';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ReportViewer from './ReportViewer';

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
      </div>
    );
  }
  
  // Use the ReportViewer component to maintain original visualization
  return <ReportViewer report={reportToDisplay} />;
};

export default SimpleReportViewer;
