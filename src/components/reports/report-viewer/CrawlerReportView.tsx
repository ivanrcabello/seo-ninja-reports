import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CrawlResult, CrawlPage, CrawlIssue, CrawlHeading } from '@/services/seo-crawler/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SeverityBadge from '@/components/clients/seo-crawler/detail/SeverityBadge';
import { AlertTriangle, Check, FileText, LinkIcon, ExternalLink, Heading1, Heading2, Heading3 } from 'lucide-react';

interface CrawlerReportViewProps {
  crawlResult: CrawlResult;
  pages: CrawlPage[];
  issues: CrawlIssue[];
  headings?: CrawlHeading[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#D62728'];
const SEVERITY_COLORS = {
  critical: '#FF0000',
  high: '#FF6B6B',
  medium: '#FFC107',
  low: '#4CAF50',
  info: '#2196F3'
};

const CrawlerReportView: React.FC<CrawlerReportViewProps> = ({ 
  crawlResult,
  pages = [],
  issues = [],
  headings = []
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Group issues by type and severity
  const issuesByType: Record<string, CrawlIssue[]> = {};
  const issuesBySeverity: Record<string, CrawlIssue[]> = {};
  
  issues.forEach(issue => {
    // Group by type
    if (!issuesByType[issue.issue_type]) {
      issuesByType[issue.issue_type] = [];
    }
    issuesByType[issue.issue_type].push(issue);
    
    // Group by severity (with default value)
    const severity = issue.severity || 'info';
    if (!issuesBySeverity[severity]) {
      issuesBySeverity[severity] = [];
    }
    issuesBySeverity[severity].push(issue);
  });
  
  // Prepare data for charts
  const issueTypeChartData = Object.entries(issuesByType).map(([type, typeIssues]) => ({
    name: type,
    count: typeIssues.length
  })).sort((a, b) => b.count - a.count).slice(0, 10);
  
  const issueSeverityChartData = Object.entries(issuesBySeverity).map(([severity, sevIssues]) => ({
    name: severity,
    value: sevIssues.length
  }));
  
  // Group headings by page
  const headingsByPage: Record<string, CrawlHeading[]> = {};
  headings.forEach(heading => {
    if (!heading.page_id) return;
    
    if (!headingsByPage[heading.page_id]) {
      headingsByPage[heading.page_id] = [];
    }
    headingsByPage[heading.page_id].push(heading);
  });

  // Helper function to check if a page has multiple h1 tags
  const hasMultipleH1s = (pageId: string): boolean => {
    const pageHeadings = headingsByPage[pageId] || [];
    return pageHeadings.filter(h => h.heading_type === 'h1').length > 1;
  };
  
  // Helper function to check if a page is missing h1 tags
  const isMissingH1 = (pageId: string): boolean => {
    const pageHeadings = headingsByPage[pageId] || [];
    return pageHeadings.filter(h => h.heading_type === 'h1').length === 0;
  };
  
  // Count heading issues across all pages
  const pagesWithMultipleH1 = Object.keys(headingsByPage).filter(hasMultipleH1s).length;
  const pagesWithMissingH1 = Object.keys(headingsByPage).filter(isMissingH1).length;
  
  // Helper function to get heading icon based on type
  const getHeadingIcon = (type: string) => {
    switch (type) {
      case 'h1': return <Heading1 className="h-4 w-4 text-blue-500" />;
      case 'h2': return <Heading2 className="h-4 w-4 text-green-500" />;
      case 'h3': return <Heading3 className="h-4 w-4 text-amber-500" />;
      default: return <Heading2 className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Helper function to get indentation based on heading type
  const getIndentationClass = (type: string) => {
    switch (type) {
      case 'h1': return 'pl-0';
      case 'h2': return 'pl-4';
      case 'h3': return 'pl-8';
      default: return 'pl-0';
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="pages">Páginas ({pages.length})</TabsTrigger>
          <TabsTrigger value="issues">Problemas ({issues.length})</TabsTrigger>
          <TabsTrigger value="headings">Encabezados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Páginas analizadas</CardTitle>
                <CardDescription>Total de páginas en el sitio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{pages.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Problemas detectados</CardTitle>
                <CardDescription>Total de problemas SEO</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{issues.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Problemas críticos</CardTitle>
                <CardDescription>Necesitan atención inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{issuesBySeverity.critical?.length || 0}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Problemas por tipo</CardTitle>
                <CardDescription>Los 10 tipos de problemas más comunes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={issueTypeChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Problemas por severidad</CardTitle>
                <CardDescription>Distribución de problemas según importancia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={issueSeverityChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {issueSeverityChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={SEVERITY_COLORS[entry.name as keyof typeof SEVERITY_COLORS] || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Problemas de estructura de encabezados</CardTitle>
              <CardDescription>Problemas con la jerarquía de encabezados H1, H2, H3</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert variant={pagesWithMultipleH1 > 0 ? "destructive" : "default"}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Páginas con múltiples H1</AlertTitle>
                  <AlertDescription>
                    {pagesWithMultipleH1} páginas tienen más de un encabezado H1
                  </AlertDescription>
                </Alert>
                
                <Alert variant={pagesWithMissingH1 > 0 ? "destructive" : "default"}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Páginas sin H1</AlertTitle>
                  <AlertDescription>
                    {pagesWithMissingH1} páginas no tienen encabezado H1
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resumen del análisis</CardTitle>
              <CardDescription>Fecha: {new Date(crawlResult.started_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">URL analizada</h3>
                <a 
                  href={crawlResult.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  {crawlResult.url}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              
              <div>
                <h3 className="font-medium">Duración del análisis</h3>
                <p>{crawlResult.total_time_seconds || 0} segundos</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Páginas analizadas</CardTitle>
              <CardDescription>Total: {pages.length} páginas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Problemas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map(page => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium truncate max-w-[200px]">
                        <a 
                          href={page.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          {page.url}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">{page.title || 'Sin título'}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.issues_count && page.issues_count > 0 ? 'destructive' : 'secondary'}>
                          {page.issues_count || 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="issues" className="space-y-6 pt-4">
          {issues.length > 0 ? (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Problemas por severidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(issuesBySeverity).map(([severity, issuesList]) => (
                      <div 
                        key={severity}
                        className="border rounded-lg p-4 flex flex-col"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <SeverityBadge severity={severity} />
                          <Badge variant="outline">{issuesList.length}</Badge>
                        </div>
                        <ul className="space-y-2 text-sm">
                          {issuesList.slice(0, 3).map(issue => (
                            <li key={issue.id} className="truncate">
                              <AlertTriangle className="h-3 w-3 inline mr-1 text-amber-500" />
                              {issue.description}
                            </li>
                          ))}
                          {issuesList.length > 3 && (
                            <li className="text-muted-foreground">
                              + {issuesList.length - 3} más...
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Todos los problemas</CardTitle>
                  <CardDescription>Total: {issues.length} problemas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Problema</TableHead>
                        <TableHead>Severidad</TableHead>
                        <TableHead>URL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issues.map(issue => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                              <span className="truncate">{issue.description}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <SeverityBadge severity={issue.severity || 'info'} />
                          </TableCell>
                          <TableCell className="truncate max-w-[200px]">
                            {issue.page_url}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Check className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium">No se encontraron problemas</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                No se encontraron problemas en el análisis. El sitio web parece estar bien optimizado.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="headings" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Estructura de encabezados</CardTitle>
              <CardDescription>
                Análisis de la jerarquía de encabezados H1, H2, H3 en las páginas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {headings.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-medium mb-2 flex items-center">
                        <Heading1 className="h-5 w-5 text-blue-500 mr-2" />
                        Encabezados H1
                      </div>
                      <div className="text-3xl font-bold">
                        {headings.filter(h => h.heading_type === 'h1').length}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        En {Object.keys(headingsByPage).filter(pageId => 
                          headingsByPage[pageId].some(h => h.heading_type === 'h1')
                        ).length} páginas
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-medium mb-2 flex items-center">
                        <Heading2 className="h-5 w-5 text-green-500 mr-2" />
                        Encabezados H2
                      </div>
                      <div className="text-3xl font-bold">
                        {headings.filter(h => h.heading_type === 'h2').length}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        En {Object.keys(headingsByPage).filter(pageId => 
                          headingsByPage[pageId].some(h => h.heading_type === 'h2')
                        ).length} páginas
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-medium mb-2 flex items-center">
                        <Heading3 className="h-5 w-5 text-amber-500 mr-2" />
                        Encabezados H3
                      </div>
                      <div className="text-3xl font-bold">
                        {headings.filter(h => h.heading_type === 'h3').length}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        En {Object.keys(headingsByPage).filter(pageId => 
                          headingsByPage[pageId].some(h => h.heading_type === 'h3')
                        ).length} páginas
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Problemas de estructura</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Alert variant={pagesWithMultipleH1 > 0 ? "destructive" : "default"}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Páginas con múltiples H1</AlertTitle>
                        <AlertDescription>
                          {pagesWithMultipleH1} páginas tienen más de un encabezado H1
                        </AlertDescription>
                      </Alert>
                      
                      <Alert variant={pagesWithMissingH1 > 0 ? "destructive" : "default"}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Páginas sin H1</AlertTitle>
                        <AlertDescription>
                          {pagesWithMissingH1} páginas no tienen encabezado H1
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Encabezados por página</h3>
                    
                    {Object.entries(headingsByPage).slice(0, 5).map(([pageId, pageHeadings]) => {
                      // Find the page URL from the heading data or pages array
                      const pageUrl = pageHeadings[0]?.page_url || 
                        pages.find(p => p.id === pageId)?.url || 
                        'Página desconocida';
                        
                      const multipleH1 = pageHeadings.filter(h => h.heading_type === 'h1').length > 1;
                      const missingH1 = pageHeadings.filter(h => h.heading_type === 'h1').length === 0;
                      
                      return (
                        <div key={pageId} className="mb-6 border rounded-lg p-4">
                          <h4 className="font-medium text-primary mb-2 truncate">
                            <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                              {pageUrl}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </h4>
                          
                          {multipleH1 && (
                            <Alert variant="destructive" className="mb-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Múltiples H1</AlertTitle>
                              <AlertDescription>
                                Esta página tiene {pageHeadings.filter(h => h.heading_type === 'h1').length} encabezados H1
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {missingH1 && (
                            <Alert variant="destructive" className="mb-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Falta H1</AlertTitle>
                              <AlertDescription>
                                Esta página no tiene ningún encabezado H1
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-16">Tipo</TableHead>
                                <TableHead>Contenido</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pageHeadings.map((heading, index) => (
                                <TableRow key={heading.id || `${pageId}-${index}`}>
                                  <TableCell>
                                    <div className="flex items-center justify-center">
                                      {getHeadingIcon(heading.heading_type)}
                                    </div>
                                  </TableCell>
                                  <TableCell className={getIndentationClass(heading.heading_type)}>
                                    {heading.content}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      );
                    })}
                    
                    {Object.keys(headingsByPage).length > 5 && (
                      <div className="text-center text-muted-foreground mt-4">
                        Mostrando 5 de {Object.keys(headingsByPage).length} páginas
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium">No se encontraron encabezados</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    No se pudieron encontrar encabezados (H1, H2, H3) en las páginas analizadas.
                    Es posible que las páginas no tengan encabezados estructurados correctamente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrawlerReportView;
