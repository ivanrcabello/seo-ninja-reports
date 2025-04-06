
import React, { useState, useMemo } from 'react';
import { CrawlPage, CrawlLink } from '@/services/seo-crawler';
import BlurredCard from '@/components/ui/BlurredCard';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ExternalLink, Search, Link, Link2, AlertTriangle, Filter, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface LinksTabContentProps {
  pageLinks: CrawlLink[];
  selectedPage: CrawlPage | null;
  pages?: CrawlPage[];
  onPageSelect?: (page: CrawlPage) => void;
}

const LinksTabContent: React.FC<LinksTabContentProps> = ({
  pageLinks = [],
  selectedPage,
  pages = [],
  onPageSelect = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterNofollow, setFilterNofollow] = useState<boolean | null>(null);
  
  console.log("[LinksTabContent] Rendering with links count:", pageLinks.length);
  console.log("[LinksTabContent] Sample link data:", pageLinks.length > 0 ? pageLinks[0] : "No links");
  
  // Group all links by type
  const { internalLinks, externalLinks, brokenLinks } = useMemo(() => {
    const internal: CrawlLink[] = [];
    const external: CrawlLink[] = [];
    const broken: CrawlLink[] = [];
    
    pageLinks.forEach(link => {
      // Ensure all links have required properties by setting defaults if needed
      const processedLink = {
        ...link,
        anchor_text: link.anchor_text || link.text || "",
        is_internal: typeof link.is_internal === 'boolean' ? link.is_internal : false,
        is_broken: typeof link.is_broken === 'boolean' ? link.is_broken : false,
        is_followed: typeof link.is_followed === 'boolean' ? link.is_followed : 
                     (typeof link.follow === 'boolean' ? link.follow : true)
      };
      
      if (processedLink.is_broken) {
        broken.push(processedLink);
      }
      
      if (processedLink.is_internal) {
        internal.push(processedLink);
      } else {
        external.push(processedLink);
      }
    });
    
    return {
      internalLinks: internal,
      externalLinks: external,
      brokenLinks: broken
    };
  }, [pageLinks]);
  
  // Filter links based on search term and nofollow filter
  const getFilteredLinks = (links: CrawlLink[]) => {
    return links.filter(link => {
      // Text search filter
      const matchesSearch = !searchTerm || 
        link.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (link.anchor_text || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      // Nofollow filter
      const matchesNofollow = filterNofollow === null || 
        (filterNofollow === true && !(link.is_followed || link.follow)) ||
        (filterNofollow === false && (link.is_followed || link.follow));
      
      return matchesSearch && matchesNofollow;
    });
  };
  
  const filteredInternalLinks = useMemo(() => getFilteredLinks(internalLinks), 
    [internalLinks, searchTerm, filterNofollow]);
  
  const filteredExternalLinks = useMemo(() => getFilteredLinks(externalLinks), 
    [externalLinks, searchTerm, filterNofollow]);
  
  const filteredBrokenLinks = useMemo(() => getFilteredLinks(brokenLinks), 
    [brokenLinks, searchTerm, filterNofollow]);
  
  const allFilteredLinks = useMemo(() => {
    if (activeTab === 'internal') return filteredInternalLinks;
    if (activeTab === 'external') return filteredExternalLinks;
    if (activeTab === 'broken') return filteredBrokenLinks;
    return [...filteredInternalLinks, ...filteredExternalLinks]; // 'all' tab
  }, [filteredInternalLinks, filteredExternalLinks, filteredBrokenLinks, activeTab]);
  
  // Find the page for a specific link
  const findPageForLink = (pageId: string) => {
    return pages.find(page => page.id === pageId);
  };
  
  // Get the count label with proper filtering
  const getCountLabel = (total: number, filtered: number) => {
    if (total === filtered) return `(${total})`;
    return `(${filtered}/${total})`;
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
        <CardDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span>Total: {pageLinks.length} enlaces encontrados</span>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar enlaces..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="ml-1" title="Filtros">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por atributo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setFilterNofollow(null)}
                  className={filterNofollow === null ? "bg-accent text-accent-foreground" : ""}
                >
                  Todos los enlaces
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilterNofollow(false)}
                  className={filterNofollow === false ? "bg-accent text-accent-foreground" : ""}
                >
                  Solo enlaces follow
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setFilterNofollow(true)}
                  className={filterNofollow === true ? "bg-accent text-accent-foreground" : ""}
                >
                  Solo enlaces nofollow
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              Todos {getCountLabel(pageLinks.length, allFilteredLinks.length)}
            </TabsTrigger>
            <TabsTrigger value="internal">
              Internos {getCountLabel(internalLinks.length, filteredInternalLinks.length)}
            </TabsTrigger>
            <TabsTrigger value="external">
              Externos {getCountLabel(externalLinks.length, filteredExternalLinks.length)}
            </TabsTrigger>
            <TabsTrigger value="broken">
              Rotos {getCountLabel(brokenLinks.length, filteredBrokenLinks.length)}
              {brokenLinks.length > 0 && <AlertTriangle className="ml-1 h-4 w-4 text-amber-500" />}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <LinksList 
              links={allFilteredLinks} 
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
        <p className="text-muted-foreground">No se encontraron enlaces para esta categoría o con los filtros seleccionados</p>
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
          {links.map((link, index) => {
            const sourcePage = findPageForLink(link.page_id);
            
            // Default followed state
            const isFollowed = link.is_followed !== undefined ? link.is_followed : 
                             (link.follow !== undefined ? link.follow : true);
            
            return (
              <TableRow key={link.id || `link-${index}`}>
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
                <TableCell>{link.anchor_text || link.text || 'Sin texto'}</TableCell>
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
                  {!isFollowed && (
                    <Badge variant="outline" className="ml-1 bg-amber-100 text-amber-800">
                      NoFollow
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
