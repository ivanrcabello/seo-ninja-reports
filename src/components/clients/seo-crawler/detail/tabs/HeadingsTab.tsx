import React from 'react';
import { CrawlHeading, CrawlPage } from '@/services/seo-crawler/types';
import { Loader2, Heading1, Heading2, Heading3 } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface HeadingsTabProps {
  pageHeadings: CrawlHeading[];
  selectedPage: CrawlPage | null;
  isLoading?: boolean;
}

const HeadingsTab: React.FC<HeadingsTabProps> = ({ 
  pageHeadings, 
  selectedPage,
  isLoading = false 
}) => {
  // Group headings by page when no specific page is selected
  const groupedHeadings = React.useMemo(() => {
    if (selectedPage) return { [selectedPage.id]: pageHeadings };
    
    const grouped: Record<string, CrawlHeading[]> = {};
    pageHeadings.forEach(heading => {
      if (!heading.page_id) return;
      
      if (!grouped[heading.page_id]) {
        grouped[heading.page_id] = [];
      }
      grouped[heading.page_id].push(heading);
    });
    
    return grouped;
  }, [pageHeadings, selectedPage]);
  
  // Helper function to get heading icon based on type
  const getHeadingIcon = (type: string) => {
    switch (type) {
      case 'h1': return <Heading1 className="h-5 w-5 text-blue-500" />;
      case 'h2': return <Heading2 className="h-5 w-5 text-green-500" />;
      case 'h3': return <Heading3 className="h-5 w-5 text-amber-500" />;
      default: return <Heading2 className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Helper function to get indentation based on heading type
  const getIndentationClass = (type: string) => {
    switch (type) {
      case 'h1': return 'pl-0';
      case 'h2': return 'pl-6';
      case 'h3': return 'pl-12';
      default: return 'pl-0';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Check if we have headings data
  if (pageHeadings.length === 0) {
    return (
      <Alert>
        <AlertTitle>No se encontraron encabezados</AlertTitle>
        <AlertDescription>
          No se pudieron encontrar encabezados (H1, H2, H3) en las páginas analizadas. 
          Es posible que las páginas no tengan encabezados o que el análisis no haya podido extraerlos correctamente.
        </AlertDescription>
      </Alert>
    );
  }
  
  // If we have a selected page or a single page's headings
  if (selectedPage || Object.keys(groupedHeadings).length === 1) {
    const headings = selectedPage 
      ? pageHeadings 
      : groupedHeadings[Object.keys(groupedHeadings)[0]];
    
    // Check for H1 issues
    const h1Headings = headings.filter(h => h.heading_type === 'h1');
    const hasMultipleH1 = h1Headings.length > 1;
    const hasMissingH1 = h1Headings.length === 0;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Estructura de encabezados {selectedPage && `- ${selectedPage.url}`}
          </h3>
        </div>
        
        {hasMultipleH1 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Múltiples encabezados H1 detectados</AlertTitle>
            <AlertDescription>
              Se encontraron {h1Headings.length} encabezados H1 en esta página. 
              Lo ideal es tener un solo encabezado H1 por página para optimización SEO.
            </AlertDescription>
          </Alert>
        )}
        
        {hasMissingH1 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Falta encabezado H1</AlertTitle>
            <AlertDescription>
              No se encontró ningún encabezado H1 en esta página. 
              Cada página debería tener un encabezado H1 para una correcta estructura y optimización SEO.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Tipo</TableHead>
                <TableHead>Contenido</TableHead>
                <TableHead className="w-20">Posición</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {headings.map((heading, index) => (
                <TableRow key={heading.id || index}>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getHeadingIcon(heading.heading_type)}
                    </div>
                  </TableCell>
                  <TableCell className={getIndentationClass(heading.heading_type)}>
                    {heading.content}
                  </TableCell>
                  <TableCell>{heading.position}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
  // Otherwise show headings grouped by page
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Estructura de encabezados por página</h3>
      
      <div className="space-y-8">
        {Object.entries(groupedHeadings).map(([pageId, headings]) => {
          // Find the page URL if available
          const pageUrl = headings[0]?.page_url || pageId;
          
          // Check for H1 issues
          const h1Headings = headings.filter(h => h.heading_type === 'h1');
          const hasMultipleH1 = h1Headings.length > 1;
          const hasMissingH1 = h1Headings.length === 0;
          
          return (
            <div key={pageId} className="space-y-2">
              <h4 className="font-medium text-primary truncate">
                {pageUrl}
              </h4>
              
              {hasMultipleH1 && (
                <Alert variant="destructive" className="mb-2">
                  <AlertTitle>Múltiples encabezados H1</AlertTitle>
                  <AlertDescription>
                    Se encontraron {h1Headings.length} encabezados H1 en esta página
                  </AlertDescription>
                </Alert>
              )}
              
              {hasMissingH1 && (
                <Alert variant="destructive" className="mb-2">
                  <AlertTitle>Falta encabezado H1</AlertTitle>
                  <AlertDescription>
                    No se encontró ningún encabezado H1 en esta página
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Tipo</TableHead>
                      <TableHead>Contenido</TableHead>
                      <TableHead className="w-20">Posición</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {headings.map((heading, index) => (
                      <TableRow key={`${pageId}-${index}`}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getHeadingIcon(heading.heading_type)}
                          </div>
                        </TableCell>
                        <TableCell className={getIndentationClass(heading.heading_type)}>
                          {heading.content}
                        </TableCell>
                        <TableCell>{heading.position}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeadingsTab;
