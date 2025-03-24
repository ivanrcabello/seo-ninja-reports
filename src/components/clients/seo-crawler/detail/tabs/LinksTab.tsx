
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CrawlPage, CrawlLink } from '@/services/seo-crawler/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink, Link as LinkIcon, Check, X } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!selectedPage) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Selecciona una página</AlertTitle>
          <AlertDescription>
            Para ver los enlaces, primero selecciona una página de la lista.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-4">Páginas analizadas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {pages.slice(0, 9).map(page => (
                <Card 
                  key={page.id}
                  className="hover:bg-muted cursor-pointer"
                  onClick={() => onPageSelect(page)}
                >
                  <CardContent className="p-3">
                    <p className="text-sm truncate">{page.url}</p>
                  </CardContent>
                </Card>
              ))}
              {pages.length > 9 && (
                <Card className="border border-dashed hover:bg-muted cursor-pointer">
                  <CardContent className="p-3 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">+{pages.length - 9} más</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const filteredLinks = pageLinks.filter(link => 
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.anchor_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="text-lg font-semibold">
              Enlaces de <span className="opacity-75 text-sm ml-1 font-normal">{selectedPage.url}</span>
            </h3>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-gray-100">
                {pageLinks.length} enlaces
              </Badge>
              
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                {pageLinks.filter(l => l.is_internal).length} internos
              </Badge>
              
              <Badge variant="outline" className="bg-amber-100 text-amber-800">
                {pageLinks.filter(l => !l.is_internal).length} externos
              </Badge>
            </div>
          </div>
          
          <Input
            placeholder="Buscar enlaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          {filteredLinks.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Texto</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="hidden md:table-cell">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map(link => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm truncate hover:underline max-w-[200px]"
                          >
                            {link.url}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm opacity-90 truncate max-w-[150px] block">
                          {link.anchor_text || <em className="opacity-50">Sin texto</em>}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {link.is_internal ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            Interno
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">
                            <ExternalLink className="h-3 w-3 mr-1" /> Externo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {link.is_broken ? (
                          <Badge variant="destructive">
                            <X className="h-3 w-3 mr-1" /> Error {link.status_code}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" /> {link.status_code}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border rounded-md">
              <p className="text-muted-foreground">No se encontraron enlaces que coincidan con la búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LinksTab;
