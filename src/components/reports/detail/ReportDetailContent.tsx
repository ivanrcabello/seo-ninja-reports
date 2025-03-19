
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Report } from '@/types/report.types';
import { Client } from '@/types/client.types';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ReportViewer from '@/components/reports/ReportViewer';
import ReportDetailHeader from './ReportDetailHeader';
import ReportDetailActions from './ReportDetailActions';

interface ReportDetailContentProps {
  report: Report | undefined;
  client: Client | null;
  isLoading: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  handleDeleteReport: () => Promise<void>;
}

const ReportDetailContent: React.FC<ReportDetailContentProps> = ({
  report,
  client,
  isLoading,
  isEditing,
  setIsEditing,
  handleDeleteReport
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <AnimatedContainer animation="fade" className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Informe No Encontrado</h2>
        <p className="text-muted-foreground mb-6">
          El informe que buscas no existe o ha sido eliminado.
        </p>
        <Button asChild>
          <Link to="/dashboard">Volver al Dashboard</Link>
        </Button>
      </AnimatedContainer>
    );
  }

  return (
    <>
      <AnimatedContainer animation="slide-down" className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <ReportDetailHeader 
            title={report.title}
            date={report.date}
            url={report.url || ''}
            status={report.status}
            clientId={report.clientId}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            reportId={report.id}
          />
          <ReportDetailActions onDeleteReport={handleDeleteReport} />
        </div>
      </AnimatedContainer>
      
      <AnimatedContainer animation="fade" delay={100}>
        <ReportViewer report={report} isEditing={isEditing} setIsEditing={setIsEditing} />
      </AnimatedContainer>
    </>
  );
};

export default ReportDetailContent;
