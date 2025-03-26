
import React, { useState } from 'react';
import { ExternalLink, CheckCircle, AlertCircle, Search, XCircle, Clock, Info } from 'lucide-react';
import { CrawlIssue, CrawlPage } from '@/services/seo-crawler';
import BlurredCard from '@/components/ui/BlurredCard';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getIssueTypeIcon, getSeverityColor } from '../utils/crawlerUtils';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface IssuesTabContentProps {
  issuesByType: Record<string, CrawlIssue[]>;
  pageIssues?: CrawlIssue[];
  selectedPage?: CrawlPage | null;
}

const IssuesTabContent: React.FC<IssuesTabContentProps> = ({ 
  issuesByType,
  pageIssues = [],
  selectedPage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  
  // Helper to get a descriptive name for issue type
  const getIssueTypeName = (issueType: string): string => {
    const names: Record<string, string> = {
      'missing_title': 'Título ausente',
      'title_length': 'Título demasiado largo o corto',
      'missing_meta_description': 'Meta descripción ausente',
      'meta_description_length': 'Meta descripción demasiado larga o corta',
      'missing_h1': 'Falta el encabezado H1',
      'multiple_h1': 'Múltiples encabezados H1',
      'slow_page': 'Página lenta',
      'broken_link': 'Enlace roto',
      'duplicate_content': 'Contenido duplicado',
      'missing_alt': 'Imágenes sin texto alternativo',
      'low_word_count': 'Contenido insuficiente',
      'no_https': 'No usa HTTPS',
      'redirect_chain': 'Cadena de redirecciones',
      'mixed_content': 'Contenido mixto (HTTP/HTTPS)',
      'mobile_unfriendly': 'No es compatible con móviles'
    };
    
    return names[issueType] || issueType.replace(/_/g, ' ');
  };
  
  // Helper to get recommended fix for common issues
  const getRecommendedFix = (issueType: string, description: string): string => {
    const fixes: Record<string, string> = {
      'missing_title': 'Añade un título descriptivo y único a esta página que incluya palabras clave relevantes.',
      'title_length': 'Ajusta la longitud del título para que tenga entre 50-60 caracteres para optimizar su visualización en resultados de búsqueda.',
      'missing_meta_description': 'Añade una meta descripción persuasiva que resuma el contenido de la página e incluya palabras clave relevantes.',
      'meta_description_length': 'Optimiza la meta descripción para que tenga entre 120-160 caracteres y sea atractiva para los usuarios.',
      'missing_h1': 'Añade un encabezado H1 relevante que incluya la palabra clave principal de la página.',
      'multiple_h1': 'Mantén solo un encabezado H1 por página. Convierte los H1 adicionales en H2.',
      'missing_alt': 'Añade texto alternativo descriptivo a todas las imágenes para mejorar la accesibilidad y el SEO.',
      'slow_page': 'Optimiza el rendimiento de la página reduciendo el tamaño de los archivos, minimizando JavaScript y CSS, y usando la carga diferida de imágenes.',
      'low_word_count': 'Expande el contenido de la página para proporcionar más valor al usuario. Se recomienda al menos 300-500 palabras para páginas principales.'
    };
    
    return fixes[issueType] || 'Revisa este problema según las mejores prácticas de SEO actuales.';
  };
  
  // Get all issues (from all pages or selected page)
  const allIssues = selectedPage 
    ? pageIssues 
    : Object.values(issuesByType).flat();
  
  // Apply search and severity filters
  const filteredIssues = allIssues.filter(issue => {
    const matchesSearch = !searchTerm || 
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.page_url || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.issue_type.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSeverity = !selectedSeverity || issue.severity === selectedSeverity;
    
    return matchesSearch && matchesSeverity;
  });
  
  // Group issues by severity
  const issuesBySeverity: Record<string, CrawlIssue[]> = {};
  filteredIssues.forEach(issue => {
    if (!issuesBySeverity[issue.severity]) {
      issuesBySeverity[issue.severity] = [];
    }
    issuesBySeverity[issue.severity].push(issue);
  });
  
  // Count issues by severity
  const criticalCount = issuesBySeverity['critical']?.length || 0;
  const highCount = issuesBySeverity['high']?.length || 0;
  const mediumCount = issuesBySeverity['medium']?.length || 0;
  const lowCount = issuesBySeverity['low']?.length || 0;
  const infoCount = issuesBySeverity['info']?.length || 0;
  
  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <BlurredCard>
        <CardHeader className="pb-2">
          <CardTitle>Resumen de problemas</CardTitle>
          <CardDescription>
            {filteredIssues.length === 0 
              ? "No se encontraron problemas de SEO" 
              : `${filteredIssues.length} problemas encontrados en total`}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Críticos</p>
                <h3 className="text-2xl font-bold text-red-700">{criticalCount}</h3>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Altos</p>
                <h3 className="text-2xl font-bold text-orange-700">{highCount}</h3>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Medios</p>
                <h3 className="text-2xl font-bold text-yellow-700">{mediumCount}</h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Bajos</p>
                <h3 className="text-2xl font-bold text-blue-700">{lowCount}</h3>
              </div>
              <Info className="h-8 w-8 text-blue-500" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Info</p>
                <h3 className="text-2xl font-bold text-gray-700">{infoCount}</h3>
              </div>
              <Info className="h-8 w-8 text-gray-500" />
            </div>
          </div>
        </CardContent>
      </BlurredCard>
      
      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar problemas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Tabs 
            defaultValue="all" 
            value={selectedSeverity || 'all'} 
            onValueChange={(value) => setSelectedSeverity(value === 'all' ? null : value)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-5 md:w-[400px]">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="critical" className="text-red-500">Críticos</TabsTrigger>
              <TabsTrigger value="high" className="text-orange-500">Altos</TabsTrigger>
              <TabsTrigger value="medium" className="text-yellow-600">Medios</TabsTrigger>
              <TabsTrigger value="low" className="text-blue-500">Bajos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Lista de problemas */}
      <BlurredCard>
        <CardHeader>
          <CardTitle>Problemas detectados</CardTitle>
          <CardDescription>
            {selectedPage 
              ? `Problemas en la página ${selectedPage.url}` 
              : 'Todos los problemas agrupados por tipo'}
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          {filteredIssues.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {selectedPage ? (
                // Mostrar todos los problemas para la página seleccionada
                filteredIssues.map((issue) => (
                  <AccordionItem value={issue.id} key={issue.id}>
                    <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                      <div className="flex items-center">
                        {getSeverityIcon(issue.severity)}
                        <span className="ml-2 flex items-center gap-2">
                          {getIssueTypeName(issue.issue_type)}
                          <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 px-6">
                      <div className="space-y-4">
                        <p className="text-sm font-medium">
                          {issue.description}
                        </p>
                        <Separator />
                        <div className="bg-muted/50 p-4 rounded-md">
                          <h4 className="text-sm font-medium mb-2">Solución recomendada:</h4>
                          <p className="text-sm">{issue.recommended_fix || getRecommendedFix(issue.issue_type, issue.description)}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                // Mostrar problemas agrupados por tipo
                Object.entries(issuesByType)
                  .filter(([_, issues]) => 
                    issues.some(issue => 
                      (!selectedSeverity || issue.severity === selectedSeverity) &&
                      (!searchTerm || 
                        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (issue.page_url || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        issue.issue_type.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    )
                  )
                  .map(([issueType, issues]) => {
                    // Filtrar las issues por búsqueda y severidad
                    const filteredTypeIssues = issues.filter(issue => 
                      (!selectedSeverity || issue.severity === selectedSeverity) &&
                      (!searchTerm || 
                        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (issue.page_url || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        issue.issue_type.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                    );
                    
                    if (filteredTypeIssues.length === 0) return null;
                    
                    return (
                      <AccordionItem value={issueType} key={issueType}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                          <div className="flex items-center">
                            {getIssueTypeIcon(issueType)}
                            <span className="ml-2">
                              {getIssueTypeName(issueType)} ({filteredTypeIssues.length})
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 px-6">
                          <div className="space-y-4">
                            <p className="text-sm font-medium">
                              {filteredTypeIssues[0].description}
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
                                    {filteredTypeIssues.map((issue: any) => (
                                      <TableRow key={issue.id}>
                                        <TableCell className="font-medium flex items-center">
                                          <a 
                                            href={issue.page_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center"
                                          >
                                            {issue.page_url && issue.page_url.length > 60 
                                              ? issue.page_url.substring(0, 60) + '...' 
                                              : issue.page_url || 'URL no disponible'}
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
                              <p className="text-sm">{filteredTypeIssues[0].recommended_fix || getRecommendedFix(issueType, filteredTypeIssues[0].description)}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })
              )}
            </Accordion>
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium">¡No se encontraron problemas!</h3>
              <p className="text-muted-foreground">
                El sitio web no presenta problemas técnicos SEO que coincidan con los criterios de búsqueda.
              </p>
            </div>
          )}
        </CardContent>
      </BlurredCard>
    </div>
  );
};

export default IssuesTabContent;
