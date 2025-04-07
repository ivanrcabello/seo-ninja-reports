
import React, { useState } from 'react';
import { CrawlLink, CrawlPage } from '@/services/seo-crawler/types';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AlertTriangle, Check, ExternalLink, Link as LinkIcon, RefreshCcw, InfoIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { getPageLinks } from '@/services/seo-crawler/api/pageQueries';
import { toast } from 'sonner';

interface LinksTabContentProps {
  pageLinks: CrawlLink[];
  selectedPage: CrawlPage | null;
  pages: CrawlPage[];
  onPageSelect: (page: CrawlPage) => void;
  fetchAttempted?: boolean;
  fetchError?: string | null;
}

const LinksTabContent: React.FC<LinksTabContentProps> = ({ 
  pageLinks, 
  selectedPage,
  pages,
  onPageSelect,
  fetchAttempted = false,
  fetchError = null
}) => {
  const [linkTypeFilter, setLinkTypeFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Ensure we have valid data to work with
  const validLinks = Array.isArray(pageLinks) ? pageLinks : [];
  
  // Count internal and external links
  const internalLinks = validLinks.filter(link => link.is_internal);
  const externalLinks = validLinks.filter(link => !link.is_internal);
  const brokenLinks = validLinks.filter(link => link.is_broken);
  
  // Filter links based on selected type
  const filteredLinks = linkTypeFilter === "all" 
    ? validLinks 
    : linkTypeFilter === "internal" 
      ? internalLinks 
      : linkTypeFilter === "external" 
        ? externalLinks 
        : linkTypeFilter === "broken" 
          ? brokenLinks 
          : validLinks;
  
  // Debugging
  console.log("[LinksTabContent] Props received:", { 
    pageLinksLength: validLinks.length,
    internalLinksLength: internalLinks.length,
    externalLinksLength: externalLinks.length,
    brokenLinksLength: brokenLinks.length,
    selectedPageId: selectedPage?.id,
    fetchAttempted
  });

  const handleRefreshLinks = async () => {
    if (!selectedPage?.id) return;
    
    setIsRefreshing(true);
    try {
      const freshLinks = await getPageLinks(selectedPage.id);
      // We don't set the links here, but trigger a refresh via parent component
      if (freshLinks.length === 0) {
        toast.info('No se encontraron enlaces en esta página');
      } else {
        toast.success(`Se encontraron ${freshLinks.length} enlaces`);
        // Force a re-render by selecting the page again
        onPageSelect(selectedPage);
      }
    } catch (error) {
      console.error('Error refreshing links:', error);
      toast.error('Error al actualizar los enlaces');
    } finally {
      setIsRefreshing(false);
    }
  };
  
  if (validLinks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {fetchError ? (
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        ) : (
          <InfoIcon className="h-12 w-12 text-amber-500 mb-4" />
        )}
        
        <h3 className="text-lg font-medium">
          {fetchError ? 'Error al obtener enlaces' : 'No se encontraron enlaces'}
        </h3>
        
        <p className="text-muted-foreground mt-2 max-w-md mb-6">
          {fetchError 
            ? fetchError
            : fetchAttempted 
              ? 'No se pudieron encontrar enlaces en esta página. Es posible que la página no tenga enlaces o que haya ocurrido un error al analizarla.'
              : 'Cargando enlaces...'}
        </p>
        
        {selectedPage && fetchAttempted && (
          <Button 
            variant="outline" 
            onClick={handleRefreshLinks}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Reintentar carga de enlaces'}
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Link counts */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium mb-2">Total enlaces</div>
              <div className="text-3xl font-bold">{validLinks.length}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium mb-2">Internos</div>
              <div className="text-3xl font-bold">{internalLinks.length}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium mb-2">Externos</div>
              <div className="text-3xl font-bold">{externalLinks.length}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="text-lg font-medium mb-2">Rotos</div>
              <div className="text-3xl font-bold">{brokenLinks.length}</div>
            </div>
          </div>
          
          {/* Filter controls */}
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg">Enlaces</h3>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshLinks}
                disabled={isRefreshing}
                className="flex items-center gap-1"
              >
                <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Actualizando...' : 'Actualizar'}
              </Button>
              
              <Select 
                value={linkTypeFilter} 
                onValueChange={setLinkTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los enlaces</SelectItem>
                  <SelectItem value="internal">Enlaces internos</SelectItem>
                  <SelectItem value="external">Enlaces externos</SelectItem>
                  {brokenLinks.length > 0 && (
                    <SelectItem value="broken">Enlaces rotos</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Links table */}
          {filteredLinks.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">URL</TableHead>
                    <TableHead>Texto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link, index) => (
                    <TableRow key={link.id || `link-${index}`}>
                      <TableCell className="font-mono text-sm truncate max-w-[180px]">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center hover:underline text-blue-600"
                        >
                          {link.url}
                          <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell>
                        {link.anchor_text || link.text || link.link_text || '-'}
                      </TableCell>
                      <TableCell>
                        {link.is_internal ? (
                          <Badge variant="outline" className="bg-blue-50">
                            <LinkIcon className="h-3 w-3 mr-1" />
                            Interno
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-50">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Externo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {link.is_broken ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Roto
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <Check className="h-3 w-3 mr-1" />
                            OK
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No se encontraron enlaces que coincidan con el filtro seleccionado
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinksTabContent;
