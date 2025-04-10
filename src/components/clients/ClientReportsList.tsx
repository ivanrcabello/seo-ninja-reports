
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BlurredCard from '@/components/ui/BlurredCard';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { FileText, Plus, BarChart, PlusCircle, Calendar, SaveAll } from 'lucide-react';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import CrawlerList from './seo-crawler/CrawlerList';
import ReportGenerator from '@/components/reports/ReportGenerator';
import ScheduledReportsList from '@/components/reports/scheduler/ScheduledReportsList';
import TemplatesDialog from '@/components/reports/templates/TemplatesDialog';

interface ClientReportsListProps {
  client: Client;
  reports: Report[];
  onCreateReport: () => void;
}

const ClientReportsList: React.FC<ClientReportsListProps> = ({ 
  client, 
  reports, 
  onCreateReport 
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'crawler' | 'scheduled'>('reports');
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const navigate = useNavigate();
  
  const handleCreateReport = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReportGenerator(true);
  }, []);

  const handleCloseReportGenerator = useCallback(() => {
    setShowReportGenerator(false);
  }, []);

  const handleViewReport = useCallback((clientId: string, reportId: string) => {
    navigate(`/clients/${clientId}/reports/${reportId}`);
  }, [navigate]);

  // If showing the report generator, render it instead of the list
  if (showReportGenerator) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={handleCloseReportGenerator}
          className="mb-4"
        >
          ← Volver a informes
        </Button>
        <ReportGenerator clientId={client.id} />
      </div>
    );
  }

  return (
    <>
      <BlurredCard>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="text-xl">Informes</CardTitle>
            <CardDescription>
              {reports.length} informes para {client.name}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={() => setShowTemplatesDialog(true)}
              className="flex items-center gap-1"
            >
              <SaveAll className="h-4 w-4" />
              <span className="hidden sm:inline">Plantillas</span>
              <span className="sm:hidden">Plantillas</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleCreateReport}
            >
              <PlusCircle className="h-4 w-4 mr-1.5" /> 
              <span className="hidden sm:inline">Nuevo Informe Automatizado</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="reports">Informes</TabsTrigger>
              <TabsTrigger value="crawler">Análisis SEO Técnico</TabsTrigger>
              <TabsTrigger value="scheduled">Informes Programados</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reports">
              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <AnimatedContainer
                      key={report.id}
                      animation="fade"
                      delay={index * 100}
                    >
                      <div 
                        onClick={() => handleViewReport(client.id, report.id)}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-background/50 hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10 cursor-pointer"
                      >
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">{report.title}</h3>
                          </div>
                          <div className="flex items-center mt-1">
                            <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                            ${report.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              report.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-red-100 text-red-800'}`}>
                              {report.status === 'completed' ? 'Completado' : 
                              report.status === 'processing' ? 'Procesando' : 
                              'Error'}
                            </div>
                            {report.summary && (
                              <p className="text-sm text-muted-foreground ml-2 line-clamp-1">
                                {report.summary}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground self-end sm:self-auto">
                          {format(new Date(report.date), 'd MMM yyyy', { locale: es })}
                        </div>
                      </div>
                    </AnimatedContainer>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay informes todavía</h3>
                  <p className="text-muted-foreground mb-6">
                    Genera tu primer informe SEO para {client.name} para comenzar.
                  </p>
                  <Button 
                    onClick={handleCreateReport}
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    Generar Informe Automatizado
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="crawler">
              <CrawlerList client={client} />
            </TabsContent>
            
            <TabsContent value="scheduled">
              <ScheduledReportsList clientId={client.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </BlurredCard>
      
      <TemplatesDialog 
        open={showTemplatesDialog} 
        onOpenChange={setShowTemplatesDialog}
        mode="manage"
      />
    </>
  );
};

export default ClientReportsList;
