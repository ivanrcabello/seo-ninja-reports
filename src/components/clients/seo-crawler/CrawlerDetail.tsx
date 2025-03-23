import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchCrawlResult, 
  fetchCrawlPages, 
  fetchCrawlIssues, 
  CrawlResult, 
  CrawlPage, 
  CrawlIssue 
} from '@/services/seo-crawler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Info, ExternalLink, Clock } from 'lucide-react';
import BlurredCard from '@/components/ui/BlurredCard';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const CrawlerDetail: React.FC = () => {
  const { clientId, crawlId } = useParams<{ clientId: string; crawlId: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [pages, setPages] = useState<CrawlPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CrawlPage | null>(null);
  const [pageIssues, setPageIssues] = useState<CrawlIssue[]>([]);
  const [issuesByType, setIssuesByType] = useState<Record<string, CrawlIssue[]>>({});
  const [issuesBySeverity, setIssuesBySeverity] = useState<Record<string, CrawlIssue[]>>({});
  
  // Cargar datos del análisis
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (!crawlId) {
          toast.error('ID de análisis no especificado');
          navigate(`/clients/${clientId}`);
          return;
        }
        
        // Obtener resultado principal
        const result = await fetchCrawlResult(crawlId);
        setCrawlResult(result);
        
        // Obtener páginas analizadas
        const pagesData = await fetchCrawlPages(crawlId);
        setPages(pagesData || []);
        
        // Obtener todos los problemas por tipo y severidad
        const issuesByType: Record<string, CrawlIssue[]> = {};
        const issuesBySeverity: Record<string, CrawlIssue[]> = {};
        
        // Para cada página, obtener sus problemas
        for (const page of pagesData) {
          const issues = await fetchCrawlIssues(page.id);
          
          // Agrupar por tipo
          issues.forEach(issue => {
            if (!issuesByType[issue.issue_type]) {
              issuesByType[issue.issue_type] = [];
            }
            issuesByType[issue.issue_type].push({
              ...issue,
              page_url: page.url // Añadir URL de la página para referencia
            } as any);
            
            // Agrupar por severidad
            if (!issuesBySeverity[issue.severity]) {
              issuesBySeverity[issue.severity] = [];
            }
            issuesBySeverity[issue.severity].push({
              ...issue,
              page_url: page.url
            } as any);
          });
        }
        
        setIssuesByType(issuesByType);
        setIssuesBySeverity(issuesBySeverity);
        
      } catch (error) {
        toast.error('Error al cargar los datos del análisis SEO');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [crawlId, clientId, navigate]);
  
  // Cargar problemas de una página específica
  const handlePageSelect = async (page: CrawlPage) => {
    try {
      setSelectedPage(page);
      const issues = await fetchCrawlIssues(page.id);
      setPageIssues(issues || []);
    } catch (error) {
      toast.error('Error al cargar los problemas de la página');
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getIssueTypeIcon = (issueType: string) => {
    if (issueType.includes('missing')) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else if (issueType.includes('too_long')) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    } else if (issueType.includes('too_short')) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    } else if (issueType.includes('error')) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" /> Completado
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="h-3 w-3 mr-1 animate-spin" /> Procesando
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="h-3 w-3 mr-1" /> Error
          </Badge>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/clients/${clientId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        
        <h1 className="text-2xl font-bold">Análisis SEO Técnico</h1>
        
        {crawlResult && (
          <div className="ml-auto">
            {getStatusBadge(crawlResult.status)}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : crawlResult ? (
        <div className="space-y-6">
          <BlurredCard>
            <CardHeader>
              <CardTitle>Resumen del Análisis</CardTitle>
              <CardDescription>
                Análisis realizado el {format(new Date(crawlResult.crawl_date), 'PPP, HH:mm', { locale: es })}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-semibold mb-2">Páginas analizadas</h3>
                      <p className="text-3xl font-bold">{crawlResult.pages_crawled}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-semibold mb-2">Problemas encontrados</h3>
                      <p className="text-3xl font-bold text-orange-500">{crawlResult.issues_count}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <h3 className="text-lg font-semibold mb-2">Tiempo de análisis</h3>
                      <p className="text-3xl font-bold">{crawlResult.total_time_seconds}s</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Problemas por severidad</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className={`border-l-4 border-l-red-500 ${
                    !issuesBySeverity['high'] || issuesBySeverity['high'].length === 0 ? 'opacity-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Alta gravedad</h4>
                          <p className="text-sm text-muted-foreground">Requieren atención inmediata</p>
                        </div>
                        <p className="text-2xl font-bold text-red-500">
                          {issuesBySeverity['high']?.length || 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={`border-l-4 border-l-orange-500 ${
                    !issuesBySeverity['medium'] || issuesBySeverity['medium'].length === 0 ? 'opacity-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Gravedad media</h4>
                          <p className="text-sm text-muted-foreground">Atender cuando sea posible</p>
                        </div>
                        <p className="text-2xl font-bold text-orange-500">
                          {issuesBySeverity['medium']?.length || 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={`border-l-4 border-l-yellow-500 ${
                    !issuesBySeverity['low'] || issuesBySeverity['low'].length === 0 ? 'opacity-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Gravedad baja</h4>
                          <p className="text-sm text-muted-foreground">Mejoras recomendadas</p>
                        </div>
                        <p className="text-2xl font-bold text-yellow-500">
                          {issuesBySeverity['low']?.length || 0}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </BlurredCard>
          
          <Tabs defaultValue="issues">
            <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
              <TabsTrigger value="issues">Problemas</TabsTrigger>
              <TabsTrigger value="pages">Páginas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="issues" className="mt-6">
              <BlurredCard>
                <CardHeader>
                  <CardTitle>Problemas agrupados por tipo</CardTitle>
                  <CardDescription>
                    Los problemas encontrados durante el análisis
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {Object.keys(issuesByType).length > 0 ? (
                      Object.entries(issuesByType).map(([issueType, issues]) => (
                        <AccordionItem value={issueType} key={issueType}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                            <div className="flex items-center">
                              {getIssueTypeIcon(issueType)}
                              <span className="ml-2">
                                {issueType.replace(/_/g, ' ')} ({issues.length})
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 px-6">
                            <div className="space-y-4">
                              <p className="text-sm font-medium">
                                {issues[0].description}
                              </p>
                              <Separator />
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">Páginas afectadas:</h4>
                                <div className="max-h-64 overflow-y-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Severidad</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {issues.map((issue: any) => (
                                        <TableRow key={issue.id}>
                                          <TableCell className="font-medium flex items-center">
                                            <a 
                                              href={issue.page_url} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-primary hover:underline flex items-center"
                                            >
                                              {issue.page_url.length > 60 
                                                ? issue.page_url.substring(0, 60) + '...' 
                                                : issue.page_url}
                                              <ExternalLink className="h-3 w-3 ml-1" />
                                            </a>
                                          </TableCell>
                                          <TableCell>
                                            <Badge 
                                              variant="outline" 
                                              className={getSeverityColor(issue.severity)}
                                            >
                                              {issue.severity}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                              
                              <div className="bg-muted/50 p-4 rounded-md">
                                <h4 className="text-sm font-medium mb-2">Solución recomendada:</h4>
                                <p className="text-sm">{issues[0].recommended_fix}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">¡No se encontraron problemas!</h3>
                        <p className="text-muted-foreground">
                          El sitio web no presenta problemas técnicos SEO.
                        </p>
                      </div>
                    )}
                  </Accordion>
                </CardContent>
              </BlurredCard>
            </TabsContent>
            
            <TabsContent value="pages" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BlurredCard className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Páginas analizadas</CardTitle>
                    <CardDescription>
                      Total: {pages.length} páginas
                    </CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardContent className="p-0">
                    <div className="max-h-[600px] overflow-y-auto">
                      {pages.map((page, index) => (
                        <AnimatedContainer
                          key={page.id}
                          animation="fade"
                          delay={index * 50}
                        >
                          <div 
                            className={`p-3 border-b cursor-pointer flex items-start hover:bg-muted/50 ${
                              selectedPage?.id === page.id ? 'bg-muted' : ''
                            }`}
                            onClick={() => handlePageSelect(page)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-1">
                                <Badge 
                                  variant="outline" 
                                  className={
                                    page.status_code >= 200 && page.status_code < 300
                                      ? 'bg-green-100 text-green-800'
                                      : page.status_code >= 300 && page.status_code < 400
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : page.status_code >= 400
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {page.status_code}
                                </Badge>
                                
                                {!page.is_indexable && (
                                  <Badge variant="outline" className="ml-2 bg-red-100 text-red-800">
                                    No indexable
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm font-medium truncate">
                                {page.url.replace(/^https?:\/\//, '')}
                              </p>
                              
                              {page.title && (
                                <p className="text-xs text-muted-foreground truncate mt-1">
                                  {page.title}
                                </p>
                              )}
                            </div>
                          </div>
                        </AnimatedContainer>
                      ))}
                    </div>
                  </CardContent>
                </BlurredCard>
                
                <BlurredCard className="md:col-span-2">
                  {selectedPage ? (
                    <>
                      <CardHeader>
                        <CardTitle>Detalles de la página</CardTitle>
                        <CardDescription>
                          <a 
                            href={selectedPage.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            {selectedPage.url}
                            <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </CardDescription>
                      </CardHeader>
                      <Separator />
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">Título</h3>
                                <div className="p-3 bg-muted rounded-md">
                                  {selectedPage.title || <span className="text-muted-foreground">No definido</span>}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">Meta descripción</h3>
                                <div className="p-3 bg-muted rounded-md">
                                  {selectedPage.meta_description || <span className="text-muted-foreground">No definida</span>}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">H1</h3>
                                <div className="p-3 bg-muted rounded-md">
                                  {selectedPage.h1 || <span className="text-muted-foreground">No definido</span>}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">Código de estado</h3>
                                <div className="p-3 bg-muted rounded-md">
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      selectedPage.status_code >= 200 && selectedPage.status_code < 300
                                        ? 'bg-green-100 text-green-800'
                                        : selectedPage.status_code >= 300 && selectedPage.status_code < 400
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : selectedPage.status_code >= 400
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }
                                  >
                                    {selectedPage.status_code}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">URL canónica</h3>
                                <div className="p-3 bg-muted rounded-md">
                                  {selectedPage.canonical_url ? (
                                    <a 
                                      href={selectedPage.canonical_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline flex items-center"
                                    >
                                      {selectedPage.canonical_url}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </a>
                                  ) : (
                                    <span className="text-muted-foreground">No definida</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">Directivas robots</h3>
                                <div className="p-3 bg-muted rounded-md">
                                  {selectedPage.robots_directives || <span className="text-muted-foreground">No definidas</span>}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className="text-sm font-medium">Indexable</h3>
                                <div className="p-3 bg-muted rounded-md">
                                  {selectedPage.is_indexable ? (
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" /> Sí
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-100 text-red-800">
                                      <XCircle className="h-3 w-3 mr-1" /> No
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Problemas detectados en esta página</h3>
                            
                            {pageIssues.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Problema</TableHead>
                                    <TableHead>Severidad</TableHead>
                                    <TableHead>Solución recomendada</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {pageIssues.map(issue => (
                                    <TableRow key={issue.id}>
                                      <TableCell>
                                        <div className="flex items-center">
                                          {getIssueTypeIcon(issue.issue_type)}
                                          <span className="ml-2">
                                            {issue.description}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge 
                                          variant="outline" 
                                          className={getSeverityColor(issue.severity)}
                                        >
                                          {issue.severity}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>{issue.recommended_fix}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <div className="text-center py-6">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                  No se encontraron problemas en esta página.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12">
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">Selecciona una página</h3>
                        <p className="text-muted-foreground">
                          Haz clic en una página en la lista para ver sus detalles
                        </p>
                      </div>
                    </div>
                  )}
                </BlurredCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <BlurredCard>
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-bold mb-4">Análisis no encontrado</h2>
            <p className="text-muted-foreground mb-6">
              No se pudo encontrar el análisis SEO solicitado.
            </p>
            <Button onClick={() => navigate(`/clients/${clientId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al cliente
            </Button>
          </CardContent>
        </BlurredCard>
      )}
    </div>
  );
};

export default CrawlerDetail;
