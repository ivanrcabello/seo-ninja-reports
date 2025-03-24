import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CrawlPage, CrawlLink } from '@/services/seo-crawler/types';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink, Link, Info } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getPageLinks } from '@/services/seo-crawler/api';

interface LinksTabProps {
  pages: CrawlPage[];
  pageLinks?: CrawlLink[];
  selectedPage: CrawlPage | null;
  onPageSelect: (page: CrawlPage) => void;
}

const LinksTab: React.FC<LinksTabProps> = ({
  pages,
  pageLinks = [],
  selectedPage,
  onPageSelect
}) => {
  const [allLinks, setAllLinks] = useState<CrawlLink[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<CrawlLink[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [linkType, setLinkType] = useState<'all' | 'internal' | 'external' | 'broken'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAllLinks = async () => {
      if (!selectedPage && pages.length > 0) {
        setLoading(true);
        try {
          const allLinksData: CrawlLink[] = [];
          
          const pagesToLoad = pages.slice(0, 10);
          
          for (const page of pagesToLoad) {
            const links = await getPageLinks(page.id);
            allLinksData.push(...links);
          }
          
          setAllLinks(allLinksData);
        } catch (error) {
          console.error('Error loading all links:', error);
        } finally {
          setLoading(false);
        }
      } else if (selectedPage && pageLinks) {
        setAllLinks(pageLinks);
      }
    };
    
    loadAllLinks();
  }, [selectedPage, pages, pageLinks]);

  useEffect(() => {
    let filtered = [...allLinks];
    
    if (linkType === 'internal') {
      filtered = filtered.filter(link => link.is_internal);
    } else if (linkType === 'external') {
      filtered = filtered.filter(link => !link.is_internal);
    } else if (linkType === 'broken') {
      filtered = filtered.filter(link => link.is_broken);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(link => 
        link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.anchor_text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredLinks(filtered);
  }, [allLinks, linkType, searchTerm]);

  if (pages.length === 0) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No se encontraron páginas</AlertTitle>
        <AlertDescription>
          No se pudieron encontrar páginas para analizar. Esto puede deberse a problemas de acceso al sitio web 
          o a errores durante el análisis.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Enlaces {selectedPage ? `de ${selectedPage.url}` : 'del sitio'}</span>
          
          <Select value={linkType} onValueChange={(value) => setLinkType(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo de enlace</SelectLabel>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="internal">Internos</SelectItem>
                <SelectItem value="external">Externos</SelectItem>
                <SelectItem value="broken">Rotos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardTitle>
        
        <div className="relative mt-2">
          <Input
            type="search"
            placeholder="Buscar enlaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Info className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredLinks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Texto de ancla</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.map(link => (
                <TableRow key={link.id}>
                  <TableCell className="max-w-[300px] truncate">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {link.url}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </TableCell>
                  <TableCell>{link.anchor_text || 'N/A'}</TableCell>
                  <TableCell>
                    {link.is_internal ? (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        <Link className="h-3 w-3 mr-1" /> Interno
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        <ExternalLink className="h-3 w-3 mr-1" /> Externo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {link.is_broken ? (
                      <Badge variant="destructive">
                        Roto
                      </Badge>
                    ) : link.status_code >= 200 && link.status_code < 300 ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {link.status_code}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        {link.status_code || 'Desconocido'}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm || linkType !== 'all' 
                ? "No se encontraron enlaces con los filtros aplicados" 
                : "No hay enlaces disponibles"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinksTab;
