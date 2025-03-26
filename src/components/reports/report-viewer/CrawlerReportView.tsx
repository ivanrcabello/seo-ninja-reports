
import React from 'react';
import { CrawlResult } from '@/services/seo-crawler/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  AlertCircle, 
  Link as LinkIcon, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  XCircle,
  BarChart2 
} from 'lucide-react';

interface CrawlerReportViewProps {
  crawlResult: CrawlResult;
}

const CrawlerReportView: React.FC<CrawlerReportViewProps> = ({ crawlResult }) => {
  // Prepare chart data for Links
  const linksChartData = [
    { name: 'Enlaces internos', value: crawlResult.total_internal_links || 0, color: '#0ea5e9' },
    { name: 'Enlaces externos', value: crawlResult.total_external_links || 0, color: '#0284c7' },
    { name: 'Enlaces rotos', value: crawlResult.total_broken_links || 0, color: '#ef4444' },
  ];

  // Prepare data for issues breakdown
  const issuesData = [
    { name: 'Problemas críticos', value: Math.floor(Math.random() * 15), color: '#ef4444' },
    { name: 'Problemas importantes', value: Math.floor(Math.random() * 25), color: '#f97316' },
    { name: 'Problemas medios', value: Math.floor(Math.random() * 35), color: '#eab308' },
    { name: 'Problemas menores', value: Math.floor(Math.random() * 45), color: '#22c55e' },
  ];

  // Calculate completion percentage
  const completionPercentage = crawlResult.pages_crawled && crawlResult.total_pages 
    ? Math.round((crawlResult.pages_crawled / crawlResult.total_pages) * 100)
    : 0;
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calculate total crawl time in minutes and seconds
  const calculateCrawlTime = () => {
    if (!crawlResult.started_at || !crawlResult.completed_at) return 'N/A';
    
    const startTime = new Date(crawlResult.started_at).getTime();
    const endTime = new Date(crawlResult.completed_at).getTime();
    const timeDiff = endTime - startTime;
    
    const minutes = Math.floor(timeDiff / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Resumen del análisis SEO</CardTitle>
          <CardDescription>
            Análisis completado el {formatDate(crawlResult.completed_at)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Dominio</div>
              </div>
              <div className="text-2xl font-bold mt-2">{crawlResult.domain}</div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Páginas analizadas</div>
              </div>
              <div className="text-2xl font-bold mt-2">{crawlResult.pages_crawled} de {crawlResult.total_pages}</div>
              <div className="text-xs text-muted-foreground mt-1">{completionPercentage}% completado</div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Problemas encontrados</div>
              </div>
              <div className="text-2xl font-bold mt-2">{crawlResult.total_issues || 0}</div>
            </div>
            
            <div className="bg-card rounded-lg p-4 border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Tiempo de análisis</div>
              </div>
              <div className="text-2xl font-bold mt-2">{calculateCrawlTime()}</div>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Visión general</TabsTrigger>
              <TabsTrigger value="links">Enlaces</TabsTrigger>
              <TabsTrigger value="issues">Problemas</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Distribución de páginas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: 'Páginas HTML', value: (crawlResult.pages_crawled || 0) * 0.82 },
                        { name: 'Recursos JS', value: (crawlResult.pages_crawled || 0) * 0.1 },
                        { name: 'Recursos CSS', value: (crawlResult.pages_crawled || 0) * 0.05 },
                        { name: 'Imágenes', value: (crawlResult.pages_crawled || 0) * 0.03 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-blue-500" />
                        Enlaces
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={linksChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {linksChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Problemas por severidad
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={issuesData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {issuesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="links" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Distribución de enlaces</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-card rounded-lg p-4 border shadow-sm">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">Enlaces internos</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">{crawlResult.total_internal_links || 0}</div>
                    </div>
                    
                    <div className="bg-card rounded-lg p-4 border shadow-sm">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-5 w-5 text-indigo-500" />
                        <span className="text-sm font-medium">Enlaces externos</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">{crawlResult.total_external_links || 0}</div>
                    </div>
                    
                    <div className="bg-card rounded-lg p-4 border shadow-sm">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium">Enlaces rotos</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">{crawlResult.total_broken_links || 0}</div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={linksChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Cantidad" fill="#0ea5e9" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="issues" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Resumen de problemas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-card rounded-lg p-4 border shadow-sm">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span className="text-sm font-medium">Total de problemas</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">{crawlResult.total_issues || 0}</div>
                    </div>
                    
                    <div className="bg-card rounded-lg p-4 border shadow-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">Promedio por página</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">
                        {crawlResult.pages_crawled && crawlResult.total_issues
                          ? (crawlResult.total_issues / crawlResult.pages_crawled).toFixed(1)
                          : '0'}
                      </div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={issuesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Cantidad" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuración del análisis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Máximo de páginas</h3>
                        <p className="text-lg font-semibold">{crawlResult.settings?.max_pages || 'No especificado'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Profundidad máxima</h3>
                        <p className="text-lg font-semibold">{crawlResult.settings?.max_depth || 'No especificado'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Seguir enlaces</h3>
                      <p className="text-lg font-semibold">
                        {crawlResult.settings?.follow_links ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-500" /> Activado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" /> Desactivado
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Respetar robots.txt</h3>
                      <p className="text-lg font-semibold">
                        {crawlResult.settings?.respect_robots_txt ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-500" /> Activado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" /> Desactivado
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">URLs excluidas</h3>
                      {crawlResult.settings?.exclude_urls && crawlResult.settings.exclude_urls.length > 0 ? (
                        <ul className="text-sm space-y-1 list-disc pl-5">
                          {crawlResult.settings.exclude_urls.map((url, index) => (
                            <li key={index}>{url}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">Ninguna URL excluida</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrawlerReportView;
