
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale'; 
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlurredCard from '@/components/ui/BlurredCard';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { FileText, Plus, BarChart } from 'lucide-react';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import CrawlerList from './seo-crawler/CrawlerList';

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
  const [showCrawlerList, setShowCrawlerList] = useState(false);
  
  const handleCreateReport = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCreateReport();
  }, [onCreateReport]);

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
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={() => setShowCrawlerList(!showCrawlerList)}
            >
              <BarChart className="h-4 w-4 mr-1.5" />
              {showCrawlerList ? 'Ver Informes' : 'Análisis SEO Técnico'}
            </Button>
            
            <Button onClick={handleCreateReport}>
              <Plus className="h-4 w-4 mr-1.5" /> Nuevo Informe
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {!showCrawlerList ? (
            reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <AnimatedContainer
                    key={report.id}
                    animation="fade"
                    delay={index * 100}
                  >
                    <Link to={`/reports/${report.id}`} className="block">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-background/50 hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                        <div className="mb-3 sm:mb-0">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">{report.title}</h3>
                          </div>
                          {report.summary && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {report.summary}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground self-end sm:self-auto">
                          {format(new Date(report.date), 'd MMM yyyy', { locale: es })}
                        </div>
                      </div>
                    </Link>
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
                  Generar Informe
                </Button>
              </div>
            )
          ) : (
            <CrawlerList client={client} />
          )}
        </CardContent>
      </BlurredCard>
    </>
  );
};

export default ClientReportsList;
