
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CrawlHeading, CrawlPage } from '@/services/seo-crawler/types';
import { AlertTriangle, Loader2, ExternalLink, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeadingsTabProps {
  pageHeadings: CrawlHeading[];
  selectedPage: CrawlPage | null;
  isLoading?: boolean;
}

const HeadingsTab: React.FC<HeadingsTabProps> = ({ 
  pageHeadings = [], 
  selectedPage, 
  isLoading = false 
}) => {
  const [selectedHeadingType, setSelectedHeadingType] = useState<string | null>(null);
  
  const getHeadingIcon = (type: string) => {
    switch (type) {
      case 'h1':
        return <span className="text-blue-600 font-bold mr-2">H1</span>;
      case 'h2':
        return <span className="text-green-600 font-bold mr-2">H2</span>;
      case 'h3':
        return <span className="text-amber-600 font-bold mr-2">H3</span>;
      default:
        return <span className="text-gray-600 font-bold mr-2">{type.toUpperCase()}</span>;
    }
  };
  
  const getIndentClass = (type: string) => {
    switch (type) {
      case 'h1': return 'pl-0';
      case 'h2': return 'pl-4';
      case 'h3': return 'pl-8';
      default: return 'pl-0';
    }
  };
  
  // Filter headings by type if a filter is selected
  const filteredHeadings = selectedHeadingType 
    ? pageHeadings.filter(h => h.heading_type === selectedHeadingType)
    : pageHeadings;

  // Count headings by type
  const h1Count = pageHeadings.filter(h => h.heading_type === 'h1').length;
  const h2Count = pageHeadings.filter(h => h.heading_type === 'h2').length;
  const h3Count = pageHeadings.filter(h => h.heading_type === 'h3').length;

  // Check for heading structure issues
  const hasMultipleH1 = h1Count > 1;
  const hasMissingH1 = h1Count === 0;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (pageHeadings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium">No se encontraron encabezados</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          No se pudieron encontrar encabezados (H1, H2, H3) en esta página.
          Es posible que la página no tenga encabezados estructurados correctamente.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium mb-2 flex items-center">
                {getHeadingIcon('h1')}
                Encabezados H1
              </div>
              <div className="text-3xl font-bold">
                {h1Count}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium mb-2 flex items-center">
                {getHeadingIcon('h2')}
                Encabezados H2
              </div>
              <div className="text-3xl font-bold">
                {h2Count}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium mb-2 flex items-center">
                {getHeadingIcon('h3')}
                Encabezados H3
              </div>
              <div className="text-3xl font-bold">
                {h3Count}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Problemas de estructura</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert variant={hasMultipleH1 ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {hasMultipleH1 ? 
                    `Esta página tiene ${h1Count} encabezados H1` : 
                    "No hay múltiples H1 en esta página"}
                </AlertDescription>
              </Alert>
              
              <Alert variant={hasMissingH1 ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {hasMissingH1 ? 
                    "Esta página no tiene encabezado H1" : 
                    "La página tiene al menos un H1"}
                </AlertDescription>
              </Alert>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Listado de encabezados</h3>
              
              <Select 
                value={selectedHeadingType || ""} 
                onValueChange={(value) => setSelectedHeadingType(value || null)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Accordion type="single" collapsible className="border rounded-lg">
              <AccordionItem value="page-headings" className="border-none">
                <div className="bg-muted p-3 border-b">
                  <AccordionTrigger className="flex items-center py-0">
                    <h4 className="font-medium text-primary truncate flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a 
                        href={selectedPage?.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:underline flex items-center truncate"
                      >
                        {selectedPage?.url || 'Página actual'}
                        <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                      </a>
                    </h4>
                  </AccordionTrigger>
                </div>
                
                <AccordionContent>
                  {(hasMultipleH1 || hasMissingH1) && (
                    <div className="p-3 border-b bg-amber-50">
                      {hasMultipleH1 && (
                        <div className="flex items-center text-amber-800 mb-1">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            Esta página tiene {h1Count} encabezados H1
                          </span>
                        </div>
                      )}
                      
                      {hasMissingH1 && (
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
                      {filteredHeadings.map((heading, index) => (
                        <div 
                          key={heading.id || `heading-${index}`}
                          className={`flex items-start rounded-md p-2 ${
                            heading.heading_type === 'h1' ? 'bg-blue-50' : 
                            heading.heading_type === 'h2' ? 'bg-green-50' :
                            heading.heading_type === 'h3' ? 'bg-amber-50' : 'bg-gray-50'
                          } ${getIndentClass(heading.heading_type)}`}
                        >
                          <div className="mr-3 flex-shrink-0 mt-0.5">
                            {getHeadingIcon(heading.heading_type)}
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
            </Accordion>
            
            {filteredHeadings.length === 0 && (
              <div className="text-center text-muted-foreground mt-4">
                No hay encabezados que coincidan con el filtro seleccionado
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadingsTab;
