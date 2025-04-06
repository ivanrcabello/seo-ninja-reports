
import React, { useState } from 'react';
import { CrawlHeading, CrawlPage } from '@/services/seo-crawler/types';
import { Loader2, Heading1, Heading2, Heading3, HeadingIcon, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HeadingsTabProps {
  pageHeadings: CrawlHeading[];
  selectedPage: CrawlPage | null;
  pages?: CrawlPage[];
  onPageSelect?: (page: CrawlPage) => void;
  isLoading?: boolean;
}

const HeadingsTab: React.FC<HeadingsTabProps> = ({ 
  pageHeadings, 
  selectedPage,
  pages = [],
  onPageSelect = () => {},
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>(selectedPage ? 'current' : 'all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  
  console.log(`[HeadingsTab] Rendering with ${pageHeadings.length} headings, selectedPage: ${selectedPage?.url}`);
  
  // Group headings by page
  const groupedHeadings = React.useMemo(() => {
    const grouped: Record<string, CrawlHeading[]> = {};
    
    pageHeadings.forEach(heading => {
      if (!heading.page_id) return;
      
      if (!grouped[heading.page_id]) {
        grouped[heading.page_id] = [];
      }
      grouped[heading.page_id].push(heading);
    });
    
    return grouped;
  }, [pageHeadings]);
  
  // Filter headings based on search term and heading type
  const filteredHeadings = React.useMemo(() => {
    let filtered = pageHeadings;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(heading => 
        heading.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        heading.page_url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by heading type
    if (filterType !== 'all') {
      filtered = filtered.filter(heading => heading.heading_type === filterType);
    }
    
    // Sort headings
    return [...filtered].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.position - b.position;
      } else {
        return b.position - a.position;
      }
    });
  }, [pageHeadings, searchTerm, filterType, sortDirection]);
  
  // Filter and get the headings for the current page
  const currentPageHeadings = React.useMemo(() => {
    if (!selectedPage) return [];
    return filteredHeadings.filter(h => h.page_id === selectedPage.id);
  }, [filteredHeadings, selectedPage]);
  
  // Find all unique pages that have headings
  const pagesWithHeadings = React.useMemo(() => {
    const pageIds = Object.keys(groupedHeadings);
    return pages.filter(page => pageIds.includes(page.id));
  }, [groupedHeadings, pages]);
  
  // Statistics by heading type
  const headingStats = React.useMemo(() => {
    const stats = {
      h1: {
        count: pageHeadings.filter(h => h.heading_type === 'h1').length,
        pages: new Set(pageHeadings.filter(h => h.heading_type === 'h1').map(h => h.page_id)).size
      },
      h2: {
        count: pageHeadings.filter(h => h.heading_type === 'h2').length,
        pages: new Set(pageHeadings.filter(h => h.heading_type === 'h2').map(h => h.page_id)).size
      },
      h3: {
        count: pageHeadings.filter(h => h.heading_type === 'h3').length,
        pages: new Set(pageHeadings.filter(h => h.heading_type === 'h3').map(h => h.page_id)).size
      },
      other: {
        count: pageHeadings.filter(h => !['h1', 'h2', 'h3'].includes(h.heading_type)).length,
        pages: new Set(pageHeadings.filter(h => !['h1', 'h2', 'h3'].includes(h.heading_type)).map(h => h.page_id)).size
      }
    };
    
    return stats;
  }, [pageHeadings]);
  
  // Helper function to get heading icon based on type
  const getHeadingIcon = (type: string) => {
    switch (type) {
      case 'h1': return <Heading1 className="h-5 w-5 text-blue-500" />;
      case 'h2': return <Heading2 className="h-5 w-5 text-green-500" />;
      case 'h3': return <Heading3 className="h-5 w-5 text-amber-500" />;
      case 'h4': return <HeadingIcon className="h-5 w-5 text-purple-500" />;
      case 'h5': return <HeadingIcon className="h-5 w-5 text-pink-500" />;
      case 'h6': return <HeadingIcon className="h-5 w-5 text-gray-500" />;
      default: return <Heading2 className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Helper function to get indentation based on heading type
  const getIndentationClass = (type: string) => {
    switch (type) {
      case 'h1': return 'pl-0';
      case 'h2': return 'pl-6';
      case 'h3': return 'pl-12';
      case 'h4': return 'pl-16';
      case 'h5': return 'pl-20';
      case 'h6': return 'pl-24';
      default: return 'pl-0';
    }
  };
  
  // Check if a page has multiple h1 tags
  const hasMultipleH1s = (pageId: string): boolean => {
    const pageHeadings = groupedHeadings[pageId] || [];
    return pageHeadings.filter(h => h.heading_type === 'h1').length > 1;
  };
  
  // Check if a page is missing h1 tags
  const isMissingH1 = (pageId: string): boolean => {
    const pageHeadings = groupedHeadings[pageId] || [];
    return pageHeadings.filter(h => h.heading_type === 'h1').length === 0;
  };
  
  // Count pages with heading issues
  const pagesWithMultipleH1 = Object.keys(groupedHeadings).filter(hasMultipleH1s).length;
  const pagesWithMissingH1 = Object.keys(groupedHeadings).filter(isMissingH1).length;

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
  
  return (
    <div className="space-y-6">
      {/* Controls for filtering and searching */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar encabezados..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue>
                {filterType === 'all' ? 'Todos los tipos' : filterType.toUpperCase()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="h1">H1 ({headingStats.h1.count})</SelectItem>
              <SelectItem value="h2">H2 ({headingStats.h2.count})</SelectItem>
              <SelectItem value="h3">H3 ({headingStats.h3.count})</SelectItem>
              <SelectItem value="h4">H4+</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            title={sortDirection === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente'}
          >
            {sortDirection === 'asc' ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Heading Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center">
              <Heading1 className="h-5 w-5 text-blue-500 mr-2" />
              <CardTitle className="text-base">H1</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold">{headingStats.h1.count}</div>
            <p className="text-xs text-muted-foreground">En {headingStats.h1.pages} páginas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center">
              <Heading2 className="h-5 w-5 text-green-500 mr-2" />
              <CardTitle className="text-base">H2</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold">{headingStats.h2.count}</div>
            <p className="text-xs text-muted-foreground">En {headingStats.h2.pages} páginas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center">
              <Heading3 className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle className="text-base">H3</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold">{headingStats.h3.count}</div>
            <p className="text-xs text-muted-foreground">En {headingStats.h3.pages} páginas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center">
              <HeadingIcon className="h-5 w-5 text-purple-500 mr-2" />
              <CardTitle className="text-base">Problemas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <div className="text-2xl font-bold">{pagesWithMultipleH1 + pagesWithMissingH1}</div>
            <p className="text-xs text-muted-foreground">
              {pagesWithMultipleH1} múlt. H1 / {pagesWithMissingH1} sin H1
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Page selection dropdown when no specific page is selected */}
      {!selectedPage && pages.length > 0 && (
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Selecciona una página:</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-between">
                <span className="truncate">
                  {selectedPage ? selectedPage.url : 'Seleccionar página...'}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] max-h-[400px] overflow-y-auto">
              {pagesWithHeadings.map(page => {
                const pageHasIssue = hasMultipleH1s(page.id) || isMissingH1(page.id);
                const headingsCount = (groupedHeadings[page.id] || []).length;
                
                return (
                  <DropdownMenuItem 
                    key={page.id} 
                    className="flex justify-between"
                    onClick={() => onPageSelect(page)}
                  >
                    <span className="truncate max-w-[200px]">{page.url}</span>
                    <div className="flex gap-1 items-center">
                      {pageHasIssue && (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          ¡Error H1!
                        </Badge>
                      )}
                      <Badge variant="secondary" className="ml-1">
                        {headingsCount}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {selectedPage && (
            <TabsTrigger value="current">
              Página actual
            </TabsTrigger>
          )}
          <TabsTrigger value="all">
            Todas las páginas
          </TabsTrigger>
          <TabsTrigger value="issues">
            Problemas ({pagesWithMultipleH1 + pagesWithMissingH1})
          </TabsTrigger>
        </TabsList>
        
        {selectedPage && (
          <TabsContent value="current" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium truncate max-w-[400px]">
                  {selectedPage.url}
                </h3>
                <Badge variant="outline">
                  {currentPageHeadings.length} encabezados
                </Badge>
              </div>
              
              {hasMultipleH1s(selectedPage.id) && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Múltiples encabezados H1 detectados</AlertTitle>
                  <AlertDescription>
                    Se encontraron {currentPageHeadings.filter(h => h.heading_type === 'h1').length} encabezados H1 en esta página. 
                    Lo ideal es tener un solo encabezado H1 por página para optimización SEO.
                  </AlertDescription>
                </Alert>
              )}
              
              {isMissingH1(selectedPage.id) && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Falta encabezado H1</AlertTitle>
                  <AlertDescription>
                    No se encontró ningún encabezado H1 en esta página. 
                    Cada página debería tener un encabezado H1 para una correcta estructura y optimización SEO.
                  </AlertDescription>
                </Alert>
              )}
              
              {currentPageHeadings.length > 0 ? (
                <HeadingsTable headings={currentPageHeadings} getHeadingIcon={getHeadingIcon} getIndentationClass={getIndentationClass} />
              ) : (
                <Alert>
                  <AlertTitle>No se encontraron encabezados</AlertTitle>
                  <AlertDescription>
                    No se encontraron encabezados en esta página que coincidan con los criterios de búsqueda.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="all" className="pt-4">
          <div className="space-y-8">
            {pagesWithHeadings.slice(0, 5).map(page => {
              const pageHeadings = groupedHeadings[page.id] || [];
              if (pageHeadings.length === 0) return null;
              
              // Apply filtering to page headings
              let filteredPageHeadings = pageHeadings;
              if (searchTerm) {
                filteredPageHeadings = filteredPageHeadings.filter(heading => 
                  heading.content.toLowerCase().includes(searchTerm.toLowerCase())
                );
              }
              if (filterType !== 'all') {
                filteredPageHeadings = filteredPageHeadings.filter(heading => 
                  heading.heading_type === filterType
                );
              }
              
              // Sort accordingly
              filteredPageHeadings = [...filteredPageHeadings].sort((a, b) => {
                if (sortDirection === 'asc') {
                  return a.position - b.position;
                } else {
                  return b.position - a.position;
                }
              });
              
              if (filteredPageHeadings.length === 0) return null;
              
              return (
                <div key={page.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary"
                      onClick={() => onPageSelect(page)}
                    >
                      {page.url}
                    </Button>
                    <Badge variant="outline">
                      {filteredPageHeadings.length} encabezados
                    </Badge>
                  </div>
                  
                  {hasMultipleH1s(page.id) && (
                    <Alert variant="destructive" className="mb-2">
                      <AlertTitle>Múltiples encabezados H1</AlertTitle>
                      <AlertDescription>
                        Se encontraron {pageHeadings.filter(h => h.heading_type === 'h1').length} encabezados H1 en esta página
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isMissingH1(page.id) && (
                    <Alert variant="destructive" className="mb-2">
                      <AlertTitle>Falta encabezado H1</AlertTitle>
                      <AlertDescription>
                        No se encontró ningún encabezado H1 en esta página
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <HeadingsTable 
                    headings={filteredPageHeadings} 
                    getHeadingIcon={getHeadingIcon} 
                    getIndentationClass={getIndentationClass} 
                  />
                </div>
              );
            })}
            
            {pagesWithHeadings.length > 5 && (
              <div className="text-center text-muted-foreground mt-4">
                <p>Mostrando 5 de {pagesWithHeadings.length} páginas</p>
                <p className="mt-1">Selecciona una página específica para ver todos sus encabezados</p>
              </div>
            )}
            
            {pagesWithHeadings.length === 0 && (
              <Alert>
                <AlertTitle>No se encontraron encabezados</AlertTitle>
                <AlertDescription>
                  No se encontraron encabezados que coincidan con los criterios de búsqueda.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="issues" className="pt-4">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Páginas con problemas de estructura</h3>
            
            {/* Pages with multiple H1s */}
            {pagesWithMultipleH1 > 0 && (
              <div className="space-y-4">
                <h4 className="text-md font-medium flex items-center">
                  <AlertTitle className="text-red-500">
                    Páginas con múltiples H1 ({pagesWithMultipleH1})
                  </AlertTitle>
                </h4>
                
                {Object.keys(groupedHeadings)
                  .filter(hasMultipleH1s)
                  .map(pageId => {
                    const page = pages.find(p => p.id === pageId);
                    if (!page) return null;
                    
                    const h1Headings = groupedHeadings[pageId].filter(h => h.heading_type === 'h1');
                    
                    return (
                      <Card key={pageId} className="border-red-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between">
                            <Button
                              variant="link"
                              className="p-0 h-auto font-medium text-primary"
                              onClick={() => onPageSelect(page)}
                            >
                              {page.url}
                            </Button>
                            <Badge variant="destructive">
                              {h1Headings.length} H1s
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {h1Headings.map((heading, index) => (
                              <div key={heading.id || index} className="flex items-center">
                                <Heading1 className="h-4 w-4 text-blue-500 mr-2" />
                                <span>{heading.content}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
            
            {/* Pages missing H1 */}
            {pagesWithMissingH1 > 0 && (
              <div className="space-y-4 mt-6">
                <h4 className="text-md font-medium flex items-center">
                  <AlertTitle className="text-red-500">
                    Páginas sin H1 ({pagesWithMissingH1})
                  </AlertTitle>
                </h4>
                
                {Object.keys(groupedHeadings)
                  .filter(isMissingH1)
                  .map(pageId => {
                    const page = pages.find(p => p.id === pageId);
                    if (!page) return null;
                    
                    const pageHeadings = groupedHeadings[pageId];
                    
                    return (
                      <Card key={pageId} className="border-red-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex justify-between">
                            <Button
                              variant="link"
                              className="p-0 h-auto font-medium text-primary"
                              onClick={() => onPageSelect(page)}
                            >
                              {page.url}
                            </Button>
                            <Badge variant="destructive">
                              Sin H1
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm mb-2">
                            Esta página no tiene un encabezado H1. Otros encabezados encontrados:
                          </p>
                          
                          {pageHeadings.length > 0 ? (
                            <div className="space-y-2">
                              {pageHeadings.slice(0, 3).map((heading, index) => (
                                <div key={heading.id || index} className="flex items-center">
                                  {getHeadingIcon(heading.heading_type)}
                                  <span className="ml-2">{heading.content}</span>
                                </div>
                              ))}
                              {pageHeadings.length > 3 && (
                                <p className="text-sm text-muted-foreground">
                                  + {pageHeadings.length - 3} más...
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No se encontraron encabezados en esta página.</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
            
            {pagesWithMultipleH1 === 0 && pagesWithMissingH1 === 0 && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">¡No se encontraron problemas!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Todas las páginas tienen una correcta estructura de encabezados H1.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Separate component for the headings table
const HeadingsTable: React.FC<{
  headings: CrawlHeading[];
  getHeadingIcon: (type: string) => JSX.Element;
  getIndentationClass: (type: string) => string;
}> = ({ headings, getHeadingIcon, getIndentationClass }) => {
  return (
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
  );
};

export default HeadingsTab;
