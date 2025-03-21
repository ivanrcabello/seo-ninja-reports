
import React, { useState, useEffect } from 'react';
import { SeoReport } from '@/types/seo-reporting.types';
import { fetchClientSeoReports } from '@/services/seoReportService';
import UploadPDF from './UploadPDF';
import SeoReportsList from './SeoReportsList';
import DashboardCards from './DashboardCards';
import KeywordsTable from './KeywordsTable';
import CompetitorsChart from './CompetitorsChart';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlurredCard from '@/components/ui/BlurredCard';

interface SeoReportingDashboardProps {
  clientId: string;
}

type ViewMode = 'list' | 'upload' | 'detail';

const SeoReportingDashboard: React.FC<SeoReportingDashboardProps> = ({ clientId }) => {
  const [reports, setReports] = useState<SeoReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<SeoReport | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [clientId]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClientSeoReports(clientId);
      setReports(data);
      
      // If we have reports and none selected, select the first one
      if (data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
      }
    } catch (error) {
      console.error('Error loading SEO reports:', error);
      toast.error('Error al cargar informes SEO', {
        description: 'No se pudieron obtener los informes SEO para este cliente'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectReport = (report: SeoReport) => {
    setSelectedReport(report);
    setViewMode('detail');
  };

  const handleCreateReport = () => {
    setViewMode('upload');
  };

  const handleUploadSuccess = () => {
    loadReports();
    setViewMode('list');
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Cargando informes SEO...</span>
      </div>
    );
  }

  return (
    <BlurredCard>
      {viewMode === 'list' && (
        <SeoReportsList
          reports={reports}
          onSelectReport={handleSelectReport}
          onCreateReport={handleCreateReport}
        />
      )}

      {viewMode === 'upload' && (
        <>
          <div className="mb-4">
            <Button variant="ghost" onClick={handleBackToList}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista
            </Button>
          </div>
          <UploadPDF clientId={clientId} onUploadSuccess={handleUploadSuccess} />
        </>
      )}

      {viewMode === 'detail' && selectedReport && (
        <>
          <div className="mb-4">
            <Button variant="ghost" onClick={handleBackToList}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista
            </Button>
          </div>
          
          <div className="space-y-6">
            <DashboardCards report={selectedReport} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Palabras Clave Principales</CardTitle>
                  <CardDescription>
                    Palabras clave más relevantes para {selectedReport.domain}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KeywordsTable keywords={selectedReport.keywordsData || []} />
                </CardContent>
              </Card>
              
              <CompetitorsChart 
                competitors={selectedReport.competitorsData || []}
                domain={selectedReport.domain}
              />
            </div>
          </div>
        </>
      )}
    </BlurredCard>
  );
};

export default SeoReportingDashboard;
