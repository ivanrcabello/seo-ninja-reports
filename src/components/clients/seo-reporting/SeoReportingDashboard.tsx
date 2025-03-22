
import React, { useState, useEffect } from 'react';
import { SeoReport } from '@/types/seo-reporting.types';
import { fetchClientSeoReports, deleteSeoReport } from '@/services/seoReportService';
import UploadPDF from './UploadPDF';
import SeoReportsList from './SeoReportsList';
import DashboardCards from './DashboardCards';
import KeywordsTable from './KeywordsTable';
import CompetitorsChart from './CompetitorsChart';
import DeleteSeoReportButton from './DeleteSeoReportButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlurredCard from '@/components/ui/BlurredCard';
import SeoTrafficChart from './SeoTrafficChart';
import RankingDistributionChart from './RankingDistributionChart';
import KeywordIntentionsChart from './KeywordIntentionsChart';
import BacklinkChart from './BacklinkChart';

interface SeoReportingDashboardProps {
  clientId: string;
}

type ViewMode = 'list' | 'upload' | 'detail';

const SeoReportingDashboard: React.FC<SeoReportingDashboardProps> = ({ clientId }) => {
  const [reports, setReports] = useState<SeoReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<SeoReport | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);

  console.log('SeoReportingDashboard rendering with clientId:', clientId);

  useEffect(() => {
    loadReports();
  }, [clientId]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      console.log('Loading SEO reports for client:', clientId);
      const data = await fetchClientSeoReports(clientId);
      console.log('Loaded SEO reports:', data);
      setReports(data);
      
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
  
  const handleDeleteReport = async (reportId: string) => {
    try {
      const success = await deleteSeoReport(reportId);
      
      if (success) {
        toast.success('Informe SEO eliminado', {
          description: 'El informe ha sido eliminado correctamente'
        });
        
        setReports(prevReports => prevReports.filter(r => r.id !== reportId));
        
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(null);
          setViewMode('list');
        }
      }
    } catch (error) {
      console.error('Error deleting SEO report:', error);
      toast.error('Error al eliminar informe SEO', {
        description: 'Ocurrió un error al eliminar el informe'
      });
    }
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
          onDeleteReport={handleDeleteReport}
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
          <div className="mb-4 flex justify-between items-center">
            <Button variant="ghost" onClick={handleBackToList}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista
            </Button>
            <DeleteSeoReportButton onDelete={() => handleDeleteReport(selectedReport.id)} />
          </div>
          
          <div className="space-y-8">
            <DashboardCards report={selectedReport} />
            
            {/* Traffic Trends Chart */}
            {selectedReport.organicTrafficData && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Tendencia de Tráfico Orgánico</CardTitle>
                  <CardDescription>
                    Evolución del tráfico orgánico para {selectedReport.domain}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SeoTrafficChart data={selectedReport.organicTrafficData} />
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Keywords Table */}
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
              
              {/* Competitors Chart */}
              <CompetitorsChart 
                competitors={selectedReport.competitorsData || []}
                domain={selectedReport.domain}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ranking Distribution Chart */}
              {selectedReport.rankingDistribution && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Distribución de Rankings</CardTitle>
                    <CardDescription>
                      Distribución de posiciones en los resultados de búsqueda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <RankingDistributionChart data={selectedReport.rankingDistribution} />
                  </CardContent>
                </Card>
              )}
              
              {/* Keyword Intentions Chart */}
              {selectedReport.keywordIntentions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Intención de Palabras Clave</CardTitle>
                    <CardDescription>
                      Distribución por tipo de intención del usuario
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <KeywordIntentionsChart data={selectedReport.keywordIntentions} />
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Backlink Types Chart */}
              {selectedReport.backlinkTypes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Tipos de Backlinks</CardTitle>
                    <CardDescription>
                      Distribución de los diferentes tipos de enlaces entrantes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <BacklinkChart 
                      data={selectedReport.backlinkTypes} 
                      domain={selectedReport.domain}
                      type="types"
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* Follow vs Nofollow Chart */}
              {selectedReport.followNofollow && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Follow vs Nofollow</CardTitle>
                    <CardDescription>
                      Distribución de enlaces Follow y Nofollow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <BacklinkChart 
                      data={selectedReport.followNofollow.map(item => ({ 
                        type: item.type, 
                        count: item.count 
                      }))}
                      domain={selectedReport.domain}
                      type="follow"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </BlurredCard>
  );
};

export default SeoReportingDashboard;
