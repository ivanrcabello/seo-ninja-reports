
import React, { useState, useMemo } from 'react';
import { CrawlPage, CrawlLink } from '@/services/seo-crawler';
import BlurredCard from '@/components/ui/BlurredCard';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ExternalLink, Search, Link, Link2, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LinksTabContentProps {
  pages: CrawlPage[];
  pageLinks?: CrawlLink[];
  selectedPage: CrawlPage | null;
  onPageSelect: (page: CrawlPage) => void;
}

const LinksTabContent: React.FC<LinksTabContentProps> = ({
  pages,
  pageLinks = [],
  selectedPage,
  onPageSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Group all links by type
  const { internalLinks, externalLinks, brokenLinks } = useMemo(() => {
    const internal: CrawlLink[] = [];
    const external: CrawlLink[] = [];
    const broken: CrawlLink[] = [];
    
    pageLinks.forEach(link => {
      if (link.is_broken) {
        broken.push(link);
      }
      
      if (link.is_internal) {
        internal.push(link);
      } else {
        external.push(link);
      }
    });
    
    return {
      internalLinks: internal,
      externalLinks: external,
      brokenLinks: broken
    };
  }, [pageLinks]);
  
  // Filter links based on search term
  const filteredInternalLinks = useMemo(() => {
    return internalLinks.filter(link => 
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
      link.anchor_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [internalLinks, searchTerm]);
  
  const filteredExternalLinks = useMemo(() => {
    return externalLinks.filter(link => 
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
      link.anchor_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [externalLinks, searchTerm]);
  
  const filteredBrokenLinks = useMemo(() => {
    return brokenLinks.filter(link => 
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
      link.anchor_text?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brokenLinks, searchTerm]);
  
  // Find the page for a specific link
  const findPageForLink = (pageId: string) => {
    return pages.find(page => page.id === pageId);
  };
  
  if (!pageLinks || pageLinks.length === 0) {
    return (
      <BlurredCard className="p-6">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <Link className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No se encontraron enlaces</h3>
          <p className="text-muted-foreground max-w-md">
            No se pudieron encontrar enlaces en las páginas analizadas. Compruebe que el sitio web permite el rastreo de enlaces.
          </p>
        </div>
      </BlurredCard>
    );
  }
  
  return (
    <BlurredCard>
      <CardHeader>
        <CardTitle>Análisis de Enlaces</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>Total: {pageLinks.length} enlaces encontrados</span>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar enlaces..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos ({pageLinks.length})</TabsTrigger>
            <TabsTrigger value="internal">Internos ({internalLinks.length})</TabsTrigger>
            <TabsTrigger value="external">Externos ({externalLinks.length})</TabsTrigger>
            <TabsTrigger value="broken">
              Rotos ({brokenLinks.length})
              {brokenLinks.length > 0 && <AlertTriangle className="ml-1 h-4 w-4 text-amber-500" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <LinksList 
              links={searchTerm ? [...filteredInternalLinks, ...filteredExternalLinks] : pageLinks} 
              findPageForLink={findPageForLink}
              onPageSelect={onPageSelect}
            />
          </TabsContent>
          
          <TabsContent value="internal" className="mt-4">
            <LinksList 
              links={filteredInternalLinks} 
              findPageForLink={findPageForLink}
              onPageSelect={onPageSelect}
            />
          </TabsContent>
          
          <TabsContent value="external" className="mt-4">
            <LinksList 
              links={filteredExternalLinks} 
              findPageForLink={findPageForLink}
              onPageSelect={onPageSelect}
            />
          </TabsContent>
          
          <TabsContent value="broken" className="mt-4">
            <LinksList 
              links={filteredBrokenLinks} 
              findPageForLink={findPageForLink}
              onPageSelect={onPageSelect}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </BlurredCard>
  );
};

interface LinksListProps {
  links: CrawlLink[];
  findPageForLink: (pageId: string) => CrawlPage | undefined;
  onPageSelect: (page: CrawlPage) => void;
}

const LinksList: React.FC<LinksListProps> = ({ links, findPageForLink, onPageSelect }) => {
  if (links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No se encontraron enlaces para esta categoría</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>URL</TableHead>
            <TableHead>Texto ancla</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Página origen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => {
            const sourcePage = findPageForLink(link.page_id);
            
            return (
              <TableRow key={link.id}>
                <TableCell className="max-w-xs truncate">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    {link.url.length > 40 ? `${link.url.substring(0, 40)}...` : link.url}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </TableCell>
                <TableCell>{link.anchor_text || 'Sin texto'}</TableCell>
                <TableCell>
                  {link.is_internal ? (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      <Link className="h-3 w-3 mr-1" /> Interno
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      <Link2 className="h-3 w-3 mr-1" /> Externo
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {link.is_broken ? (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Error {link.status_code}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {link.status_code || 200}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {sourcePage ? (
                    <button 
                      onClick={() => onPageSelect(sourcePage)}
                      className="text-primary hover:underline truncate max-w-[200px] inline-block"
                    >
                      {sourcePage.url.replace(/^https?:\/\//, '').substring(0, 30)}
                      {sourcePage.url.length > 30 ? '...' : ''}
                    </button>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LinksTabContent;
