
import React from 'react';
import { Report } from '@/types/report.types';
import { useParams } from 'react-router-dom';
import ReportTabs from './report-viewer/ReportTabs';
import ReportHeader from './report-viewer/ReportHeader';
import BlurredCard from '@/components/ui/BlurredCard';
import { SkeletonReport } from './report-viewer/SkeletonReport';
import useReports from '@/hooks/useReports';
import { Loader2 } from 'lucide-react';

interface ReportViewerProps {
  reportId?: string;
  report?: Report;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportId, report: providedReport }) => {
  const { id } = useParams();
  const { getReport, isLoading: reportsLoading } = useReports();
  
  console.log("ReportViewer wrapper rendering with:", { reportId, hasReport: !!providedReport });
  
  // Determine which report to use
  const effectiveId = reportId || id;
  const report = providedReport || (effectiveId ? getReport(effectiveId) : undefined);
  
  if (!report) {
    console.error("ReportViewer: No report data available");
    return <div className="text-red-500 p-4">Error: No report data available</div>;
  }
  
  // Show loading state
  if (reportsLoading && !providedReport) {
    return <SkeletonReport />;
  }
  
  // Show processing state
  if (report.status === 'processing') {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Generando informe...</h2>
            <p className="text-muted-foreground">
              Esto puede tardar unos minutos dependiendo del tamaño del sitio web.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show failed state
  if (report.status === 'failed') {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <BlurredCard className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-500">
            Error en la generación del informe
          </h2>
          <p className="mb-4">
            {report.summary || 'No se pudo completar la generación del informe.'}
          </p>
          <p className="text-muted-foreground text-sm">
            Por favor, comprueba la URL y vuelve a intentarlo, o contacta con soporte si el problema persiste.
          </p>
        </BlurredCard>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <BlurredCard className="p-0 overflow-hidden">
        <ReportHeader 
          title={report.title}
          date={report.date}
          url={report.url || ''}
          isEditing={false}
          reportId={report.id}
          setIsEditing={() => {}}
        />
        
        <ReportTabs 
          report={report}
          isEditing={false}
          onSaveEdit={async () => {}}
        />
      </BlurredCard>
    </div>
  );
};

export default ReportViewer;
