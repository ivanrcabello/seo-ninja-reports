
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardCards from './DashboardCards';
import SeoTrafficChart from './SeoTrafficChart';
import KeywordsTable from './KeywordsTable';
import RankingDistributionChart from './RankingDistributionChart';
import KeywordIntentionsChart from './KeywordIntentionsChart';
import CompetitorsChart from './CompetitorsChart';
import BacklinkChart from './BacklinkChart';
import SeoReportsList from './SeoReportsList';
import UploadPDF from './UploadPDF';
import { fetchClientSeoReports, deleteSeoReport } from '@/services/seoReport';
import { SeoReport } from '@/types/seo-reporting.types';
import { AlertCircle, Loader2, BadgeInfo } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import DeleteSeoReportButton from './DeleteSeoReportButton';

interface SeoReportingDashboardProps {
  clientId: string;
}

const SeoReportingDashboard: React.FC<SeoReportingDashboardProps> = ({ clientId }) => {
  const [reports, setReports] = useState<SeoReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<SeoReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  useEffect(() => {
    console.info('SeoReportingDashboard rendering with clientId:', clientId);
    if (clientId) {
      loadReports();
    }
  }, [clientId]);
  
  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const reportData = await fetchClientSeoReports(clientId);
      
      if (reportData.length > 0) {
        setReports(reportData);
        setSelectedReport(reportData[0]); // Select the first report by default
      } else {
        setReports([]);
        setSelectedReport(null);
      }
    } catch (err: any) {
      console.error('Error loading SEO reports:', err);
      setError(err.message || 'Error al cargar informes SEO');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteReport = async (reportId: string) => {
    try {
      console.info('Deleting SEO report:', reportId);
      await deleteSeoReport(reportId);
      console.info('SEO report deleted successfully');
      
      // Remove the deleted report from state
      setReports(prevReports => prevReports.filter(report => report.id !== reportId));
      
      // If the deleted report was the selected one, select the first available report
      if (selectedReport && selectedReport.id === reportId) {
        const remainingReports = reports.filter(report => report.id !== reportId);
        setSelectedReport(remainingReports.length > 0 ? remainingReports[0] : null);
      }
      
      toast.success('Informe SEO eliminado correctamente');
    } catch (err: any) {
      console.error('Error deleting SEO report:', err);
      toast.error('Error al eliminar el informe SEO');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      {reports.length === 0 ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informes SEO</CardTitle>
              <CardDescription>
                No hay informes SEO para este cliente. Sube un informe para comenzar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadPDF clientId={clientId} onUploadSuccess={loadReports} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Informes SEO</h2>
              <p className="text-muted-foreground">
                Análisis de SEO para {selectedReport?.domain || 'este dominio'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedReport && (
                <DeleteSeoReportButton onDelete={() => handleDeleteReport(selectedReport.id)} />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <SeoReportsList 
              reports={reports} 
              selectedReport={selectedReport} 
              onSelectReport={setSelectedReport} 
              onDeleteReport={handleDeleteReport}
            />
            
            {selectedReport ? (
              <Tabs 
                defaultValue="overview" 
                className="w-full" 
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-4">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="keywords">Palabras Clave</TabsTrigger>
                  <TabsTrigger value="competitors">Competidores</TabsTrigger>
                  <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
                  <TabsTrigger value="ranking">Rankings</TabsTrigger>
                  <TabsTrigger value="upload">Subir PDF</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <DashboardCards report={selectedReport} />
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tráfico Orgánico</CardTitle>
                        <CardDescription>Tendencia de tráfico en los últimos meses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SeoTrafficChart data={selectedReport.organicTrafficData || []} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribución de Rankings</CardTitle>
                        <CardDescription>Posiciones de palabras clave</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RankingDistributionChart data={selectedReport.rankingDistribution || []} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="keywords" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Palabras Clave Orgánicas</CardTitle>
                      <CardDescription>
                        Análisis de las palabras clave principales de {selectedReport.domain}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <KeywordsTable keywords={selectedReport.keywordsData || []} />
                      
                      {selectedReport.keywordIntentions && selectedReport.keywordIntentions.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Intenciones de Búsqueda</h3>
                          <KeywordIntentionsChart data={selectedReport.keywordIntentions} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="competitors" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Competidores Orgánicos</CardTitle>
                      <CardDescription>
                        Principales competidores en búsquedas orgánicas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CompetitorsChart 
                        competitors={selectedReport.competitorsData || []} 
                        domain={selectedReport.domain}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="backlinks" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Análisis de Backlinks</CardTitle>
                      <CardDescription>
                        Perfil de enlaces entrantes a {selectedReport.domain}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedReport.backlinkTypes && selectedReport.backlinkTypes.length > 0 ? (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Tipos de Backlinks</h3>
                          <BacklinkChart 
                            types={selectedReport.backlinkTypes} 
                            followData={selectedReport.followNofollow || []} 
                          />
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <BadgeInfo className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No hay datos disponibles de backlinks</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="ranking" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución de Rankings</CardTitle>
                      <CardDescription>
                        Análisis de posiciones en los resultados de búsqueda
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RankingDistributionChart 
                        data={selectedReport.rankingDistribution || []} 
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subir Nuevo Informe</CardTitle>
                      <CardDescription>
                        Actualiza los datos SEO subiendo un informe reciente
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UploadPDF clientId={clientId} onUploadSuccess={loadReports} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    <BadgeInfo className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Selecciona un informe para ver sus detalles</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeoReportingDashboard;
