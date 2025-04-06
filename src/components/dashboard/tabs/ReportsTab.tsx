
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useReports from '@/hooks/useReports'; 
import useClients from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search, BarChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getCrawlResults } from '@/services/seo-crawler/api';
import { CrawlResult } from '@/services/seo-crawler/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export interface ReportsTabProps {
  reports?: any[];
}

const ReportsTab: React.FC<ReportsTabProps> = (props) => {
  const { reports, isLoading } = useReports();
  const { clients, isLoading: isClientsLoading } = useClients();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([]);
  const [isCrawlsLoading, setIsCrawlsLoading] = useState(true);

  // Load SEO crawler results
  useEffect(() => {
    const loadCrawlResults = async () => {
      try {
        setIsCrawlsLoading(true);
        // Get all crawl results for all clients
        const allCrawlResults: CrawlResult[] = [];
        
        console.log("Loading crawler results for clients:", clients.length);
        
        // Fetch crawl results for each client
        for (const client of clients) {
          try {
            console.log(`Fetching crawler results for client: ${client.id}`);
            const clientCrawls = await getCrawlResults(client.id);
            
            if (clientCrawls && Array.isArray(clientCrawls)) {
              console.log(`Found ${clientCrawls.length} crawls for client ${client.id}`);
              allCrawlResults.push(...clientCrawls);
            }
          } catch (error) {
            console.error(`Error loading SEO crawler results for client ${client.id}:`, error);
          }
        }
        
        console.log(`Loaded ${allCrawlResults.length} SEO Crawler results for dashboard`);
        setCrawlResults(allCrawlResults);
      } catch (error) {
        console.error('Error loading SEO crawler results:', error);
        toast.error("Error al cargar los análisis SEO");
      } finally {
        setIsCrawlsLoading(false);
      }
    };

    // Only load crawl results if we have clients
    if (clients && clients.length > 0) {
      loadCrawlResults();
    } else {
      setIsCrawlsLoading(false);
    }
  }, [clients]);

  const filteredReports = reports?.filter(report =>
    report.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCrawls = crawlResults?.filter(crawl =>
    crawl.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crawl.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get client name helper function
  const getClientName = (clientId: string) => {
    const client = clients.find(client => client.id === clientId);
    return client?.name || 'Cliente no encontrado';
  };

  // Handle loading states
  const isAllLoading = isLoading || isClientsLoading || isCrawlsLoading;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Informes</h1>
        <Button asChild className="flex gap-2">
          <Link to="/reports/new">
            <Plus size={16} />
            <span className="hidden sm:inline">Nuevo Informe</span>
            <span className="sm:hidden">Nuevo</span>
          </Link>
        </Button>
      </div>

      <Card className="border border-border">
        <CardHeader className="bg-muted/50 px-6">
          <CardTitle className="text-lg font-medium">Lista de Informes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar informe..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isAllLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-64 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            </div>
          ) : ((!filteredReports || filteredReports.length === 0) && (!filteredCrawls || filteredCrawls.length === 0)) ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No se encontraron informes</p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/reports/new">
                  <Plus size={16} />
                  Añadir nuevo informe
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Automated SEO Reports Section */}
              {filteredReports && filteredReports.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Informes SEO Automáticos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReports.map(report => (
                      <Link to={`/reports/${report.id}`} key={report.id}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground">
                              Cliente: {clients.find(client => client.id === report.clientId)?.name || 'N/A'}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical SEO Reports Section */}
              {filteredCrawls && filteredCrawls.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Análisis SEO Técnico</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCrawls.map(crawl => (
                      <Link 
                        to={`/clients/${crawl.client_id}/crawler/${crawl.id}`} 
                        key={crawl.id}
                      >
                        <Card className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-sm font-medium truncate">
                                {crawl.domain || new URL(crawl.url).hostname}
                              </CardTitle>
                              <div className={`px-2 py-1 text-xs rounded-full ${
                                crawl.status === 'completed' ? 'bg-green-100 text-green-800' :
                                crawl.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                crawl.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {crawl.status === 'completed' ? 'Completado' :
                                crawl.status === 'processing' ? 'Procesando' :
                                crawl.status === 'failed' ? 'Error' : 'Pendiente'}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <p>Cliente: {getClientName(crawl.client_id)}</p>
                              <div className="flex items-center">
                                <BarChart className="h-3 w-3 mr-1" />
                                <span>{crawl.pages_crawled || 0} páginas</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
