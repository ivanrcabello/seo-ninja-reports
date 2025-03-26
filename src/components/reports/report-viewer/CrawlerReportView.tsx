
import React, { useState, useEffect } from 'react';
import { CrawlResult, CrawlPage, CrawlIssue } from '@/services/seo-crawler/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchIssueTypesDistribution, fetchSeverityDistribution } from '@/services/seo-crawler/additionalApi';
import TechnicalTab from './TechnicalTab';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Loader2, AlertCircle, Link, FileText, Check } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

interface CrawlerReportViewProps {
  crawlResult: CrawlResult;
  pages?: CrawlPage[];
  issues?: CrawlIssue[];
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#facc15',
  low: '#22c55e',
  info: '#3b82f6'
};

const CrawlerReportView: React.FC<CrawlerReportViewProps> = ({ 
  crawlResult,
  pages = [],
  issues = []
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [issueTypes, setIssueTypes] = useState<any[]>([]);
  const [severityDistribution, setSeverityDistribution] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate report content
  const generateTechnicalReport = () => {
    if (!crawlResult) return '';
    
    const issueCount = crawlResult.total_issues || 0;
    const pagesCount = crawlResult.pages_crawled || 0;
    const domain = crawlResult.domain || '';
    
    let reportContent = `# Análisis Técnico SEO de ${domain}\n\n`;
    
    // Add summary statistics
    reportContent += `## Resumen Técnico\n\n`;
    reportContent += `- Dominio analizado: ${domain}\n`;
    reportContent += `- Páginas analizadas: ${pagesCount}\n`;
    reportContent += `- Problemas detectados: ${issueCount}\n`;
    reportContent += `- Enlaces internos: ${crawlResult.total_internal_links || 0}\n`;
    reportContent += `- Enlaces externos: ${crawlResult.total_external_links || 0}\n`;
    reportContent += `- Enlaces rotos: ${crawlResult.total_broken_links || 0}\n\n`;
    
    // Add issues summary if available
    if (issueTypes.length > 0) {
      reportContent += `## Principales Problemas Detectados\n\n`;
      issueTypes.slice(0, 5).forEach(issue => {
        reportContent += `- ${issue.type}: ${issue.count} instancias (${issue.severity})\n`;
      });
      reportContent += '\n';
    }
    
    // Add advice based on issues
    reportContent += `## Recomendaciones Técnicas\n\n`;
    
    if (crawlResult.total_broken_links > 0) {
      reportContent += `- **Arreglar enlaces rotos**: Se detectaron ${crawlResult.total_broken_links} enlaces rotos. Reparar estos enlaces mejorará la experiencia de usuario y la indexabilidad: 85/100\n`;
    }
    
    if (issueTypes.some(i => i.type.includes('title') || i.type.includes('meta'))) {
      reportContent += `- **Optimizar metadatos**: Mejorar títulos y meta descripciones para mejorar el CTR en resultados de búsqueda: 70/100\n`;
    }
    
    if (issueTypes.some(i => i.type.includes('h1'))) {
      reportContent += `- **Estructura de encabezados**: Asegurar que todas las páginas tengan un H1 único y descriptivo: 65/100\n`;
    }
    
    // Add some general recommendations
    reportContent += `- **Velocidad de carga**: Optimizar imágenes y recursos para mejorar los tiempos de carga: 75/100\n`;
    reportContent += `- **Mobile-friendly**: Asegurar que el sitio sea completamente responsive: 80/100\n`;
    reportContent += `- **Seguridad HTTPS**: Mantener certificados SSL actualizados: 90/100\n\n`;
    
    // Add conclusion
    reportContent += `## Conclusión\n\n`;
    reportContent += `El análisis técnico SEO de ${domain} ha revelado ${issueCount} problemas que deben ser abordados para mejorar el rendimiento del sitio en motores de búsqueda. Priorizando la corrección de los problemas más críticos, se podrá mejorar significativamente la visibilidad y experiencia de usuario del sitio web.`;
    
    return reportContent;
  };
  
  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      if (!crawlResult || !crawlResult.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch issue types distribution
        const issueTypesData = await fetchIssueTypesDistribution(crawlResult.id);
        setIssueTypes(issueTypesData);
        
        // Fetch severity distribution
        const severityData = await fetchSeverityDistribution(crawlResult.id);
        setSeverityDistribution(severityData);
        
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [crawlResult]);
  
  // If there's no crawl result, show error
  if (!crawlResult) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se pudo cargar el resultado del análisis.
        </AlertDescription>
      </Alert>
    );
  }
  
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
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="overview">General</TabsTrigger>
          <TabsTrigger value="issues">Problemas</TabsTrigger>
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="links">Enlaces</TabsTrigger>
          <TabsTrigger value="technical">SEO Técnico</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resumen del Rastreo</CardTitle>
                <CardDescription>
                  {formatDate(crawlResult.completed_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">URL:</dt>
                    <dd className="text-sm font-medium">{crawlResult.url}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Páginas:</dt>
                    <dd className="text-sm font-medium">{crawlResult.pages_crawled} / {crawlResult.total_pages}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Problemas:</dt>
                    <dd className="text-sm font-medium">{crawlResult.total_issues}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Estado:</dt>
                    <dd className="text-sm font-medium">
                      <Badge variant={
                        crawlResult.status === 'completed' ? 'success' : 
                        crawlResult.status === 'failed' ? 'destructive' : 
                        'secondary'
                      }>
                        {crawlResult.status === 'completed' ? 'Completado' : 
                        crawlResult.status === 'failed' ? 'Fallido' : 
                        crawlResult.status === 'processing' ? 'Procesando' : 'En cola'}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Distribución de Problemas</CardTitle>
                <CardDescription>
                  Tipos de problemas encontrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : issueTypes.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={issueTypes.slice(0, 5)}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Severidad de Problemas</CardTitle>
                <CardDescription>
                  Distribución por nivel de severidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : severityDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={severityDistribution.filter(item => item.count > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {severityDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px]">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Enlaces</CardTitle>
              <CardDescription>
                Distribución de enlaces internos y externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <p className="text-3xl font-bold">{crawlResult.total_links || 0}</p>
                  <p className="text-sm text-muted-foreground">Enlaces Totales</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <p className="text-3xl font-bold">{crawlResult.total_internal_links || 0}</p>
                  <p className="text-sm text-muted-foreground">Enlaces Internos</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <p className="text-3xl font-bold">{crawlResult.total_external_links || 0}</p>
                  <p className="text-sm text-muted-foreground">Enlaces Externos</p>
                </div>
              </div>
              {crawlResult.total_broken_links > 0 && (
                <Alert className="mt-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Enlaces Rotos Detectados</AlertTitle>
                  <AlertDescription>
                    Se encontraron {crawlResult.total_broken_links} enlaces rotos que deberían corregirse.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Problemas Detectados</CardTitle>
              <CardDescription>
                Lista de problemas encontrados durante el análisis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : issueTypes.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo de Problema</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Severidad</TableHead>
                        <TableHead>Sugerencia</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issueTypes.map((issue, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{issue.type}</TableCell>
                          <TableCell>{issue.count}</TableCell>
                          <TableCell>
                            <Badge variant={
                              issue.severity === 'critical' ? 'destructive' :
                              issue.severity === 'high' ? 'destructive' :
                              issue.severity === 'medium' ? 'warning' :
                              issue.severity === 'low' ? 'secondary' :
                              'outline'
                            }>
                              {issue.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {issue.type.includes('title') ? 'Optimizar títulos' :
                             issue.type.includes('meta') ? 'Mejorar meta descripciones' :
                             issue.type.includes('h1') ? 'Añadir H1 únicos y descriptivos' :
                             issue.type.includes('image') ? 'Añadir atributos alt a imágenes' :
                             issue.type.includes('broken') ? 'Corregir enlaces rotos' :
                             'Revisar y corregir'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Check className="h-10 w-10 text-green-500 mb-2" />
                  <p className="text-muted-foreground">No se encontraron problemas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Páginas Analizadas</CardTitle>
              <CardDescription>
                Lista de páginas indexadas del sitio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pages.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>H1</TableHead>
                        <TableHead>Problemas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages.map((page, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium truncate max-w-[200px]">
                            <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                              <span className="truncate">{page.url}</span>
                              <Link className="h-3 w-3 ml-1 flex-shrink-0" />
                            </a>
                          </TableCell>
                          <TableCell className="truncate max-w-[200px]">
                            {page.title || 'Sin título'}
                          </TableCell>
                          <TableCell className="truncate max-w-[200px]">
                            {page.h1 ? 
                              page.h1.replace(/<[^>]*>/g, '') : 
                              'Sin H1'}
                          </TableCell>
                          <TableCell>
                            {page.issues_count > 0 ? (
                              <Badge variant="destructive">{page.issues_count}</Badge>
                            ) : (
                              <Badge variant="success">0</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No hay páginas disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Links Tab */}
        <TabsContent value="links" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Enlaces</CardTitle>
              <CardDescription>
                Resumen y detalles de enlaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Enlaces Internos</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-3xl font-bold">{crawlResult.total_internal_links || 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Enlaces Externos</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-3xl font-bold">{crawlResult.total_external_links || 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Enlaces Rotos</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-3xl font-bold">{crawlResult.total_broken_links || 0}</p>
                  </CardContent>
                </Card>
              </div>
              
              {crawlResult.total_broken_links > 0 ? (
                <Alert className="mb-6" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Enlaces Rotos Detectados</AlertTitle>
                  <AlertDescription>
                    Se encontraron {crawlResult.total_broken_links} enlaces rotos que deben ser corregidos para mejorar la experiencia del usuario y el SEO.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mb-6" variant="success">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Enlaces en Buen Estado</AlertTitle>
                  <AlertDescription>
                    No se detectaron enlaces rotos durante el análisis.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recomendaciones para Enlaces</h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Asegurarse de que los enlaces internos importantes tengan texto de anclaje descriptivo</li>
                  <li>Utilizar una estructura de enlazado interna lógica que facilite la navegación</li>
                  <li>Incluir enlaces a páginas relevantes de autoridad para mejorar la credibilidad</li>
                  <li>Revisar y corregir los enlaces rotos inmediatamente</li>
                  <li>Utilizar atributos rel="nofollow" para enlaces externos no confiables</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Technical SEO Tab */}
        <TabsContent value="technical" className="space-y-4 pt-4">
          <TechnicalTab content={generateTechnicalReport()} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrawlerReportView;
