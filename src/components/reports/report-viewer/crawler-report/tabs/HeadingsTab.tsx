
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CrawlHeading, CrawlPage } from '@/services/seo-crawler/types';
import { AlertTriangle, FileText, ExternalLink, ChevronDown } from 'lucide-react';
import HeadingIcon from '../components/HeadingIcon';
import { groupHeadingsByPage, hasMultipleH1s, isMissingH1, createPageMap } from '../utils/crawlerReportUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeadingsTabProps {
  headings?: CrawlHeading[];
  pages: CrawlPage[];
}

const HeadingsTab: React.FC<HeadingsTabProps> = ({ headings = [], pages = [] }) => {
  const [selectedPageId, setSelectedPageId] = React.useState<string | null>(null);
  const headingsByPage = groupHeadingsByPage(headings);
  const pageMap = createPageMap(pages);

  // If we have a selected page, filter headings to just that page
  const filteredHeadingsByPage = selectedPageId ? 
    { [selectedPageId]: headingsByPage[selectedPageId] || [] } : 
    headingsByPage;
  
  const pagesWithMultipleH1 = Object.keys(headingsByPage).filter(pageId => 
    hasMultipleH1s(pageId, headingsByPage)
  ).length;
  
  const pagesWithMissingH1 = Object.keys(headingsByPage).filter(pageId => 
    isMissingH1(pageId, headingsByPage)
  ).length;
  
  const getIndentationClass = (type: string) => {
    switch (type) {
      case 'h1': return 'pl-0';
      case 'h2': return 'pl-4';
      case 'h3': return 'pl-8';
      default: return 'pl-0';
    }
  };
  
  if (headings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium">No se encontraron encabezados</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          No se pudieron encontrar encabezados (H1, H2, H3) en las páginas analizadas.
          Es posible que las páginas no tengan encabezados estructurados correctamente.
        </p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estructura de encabezados</CardTitle>
        <CardDescription>
          Análisis de la jerarquía de encabezados H1, H2, H3 en las páginas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium mb-2 flex items-center">
                <HeadingIcon type="h1" className="h-5 w-5 mr-2" />
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
                <HeadingIcon type="h2" className="h-5 w-5 mr-2" />
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
                <HeadingIcon type="h3" className="h-5 w-5 mr-2" />
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
            
            <div className="mb-4">
              <Select 
                value={selectedPageId || "all"} 
                onValueChange={(value) => setSelectedPageId(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar página para filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Mostrar todas las páginas</SelectItem>
                  {Object.keys(headingsByPage).map(pageId => {
                    const pageUrl = headingsByPage[pageId][0]?.page_url || 
                      pages.find(p => p.id === pageId)?.url || 
                      'Página desconocida';
                    return (
                      <SelectItem key={pageId} value={pageId}>
                        {pageUrl.length > 50 ? `${pageUrl.substring(0, 50)}...` : pageUrl}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {Object.entries(filteredHeadingsByPage).map(([pageId, pageHeadings]) => {
                const pageUrl = pageHeadings[0]?.page_url || 
                  pages.find(p => p.id === pageId)?.url || 
                  'Página desconocida';
                  
                const multipleH1 = hasMultipleH1s(pageId, headingsByPage);
                const missingH1 = isMissingH1(pageId, headingsByPage);
                
                return (
                  <AccordionItem key={pageId} value={pageId} className="border rounded-lg">
                    <div className="bg-muted p-3 border-b">
                      <AccordionTrigger className="flex items-center py-0">
                        <h4 className="font-medium text-primary truncate flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center truncate">
                            {pageUrl}
                            <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                          </a>
                        </h4>
                      </AccordionTrigger>
                    </div>
                    
                    <AccordionContent>
                      {(multipleH1 || missingH1) && (
                        <div className="p-3 border-b bg-amber-50">
                          {multipleH1 && (
                            <div className="flex items-center text-amber-800 mb-1">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                Esta página tiene {pageHeadings.filter(h => h.heading_type === 'h1').length} encabezados H1
                              </span>
                            </div>
                          )}
                          
                          {missingH1 && (
                            <div className="flex items-center text-amber-800">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                Esta página no tiene ningún encabezado H1
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-3">
                        <div className="space-y-2">
                          {pageHeadings.map((heading, index) => (
                            <div 
                              key={heading.id || `${pageId}-${index}`}
                              className={`flex items-start rounded-md p-2 ${
                                heading.heading_type === 'h1' ? 'bg-blue-50' : 
                                heading.heading_type === 'h2' ? 'bg-green-50' :
                                heading.heading_type === 'h3' ? 'bg-amber-50' : 'bg-gray-50'
                              } ${getIndentationClass(heading.heading_type)}`}
                            >
                              <div className="mr-3 flex-shrink-0 mt-0.5">
                                <HeadingIcon type={heading.heading_type} />
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {heading.heading_type.toUpperCase()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {heading.content}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            
            {Object.keys(headingsByPage).length > 0 && Object.keys(filteredHeadingsByPage).length === 0 && (
              <div className="text-center text-muted-foreground mt-4">
                No hay páginas que coincidan con el filtro seleccionado
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadingsTab;
