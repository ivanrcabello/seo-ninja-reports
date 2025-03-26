
import React, { useState } from 'react';
import { CrawlPage } from '@/services/seo-crawler/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle } from 'lucide-react';

interface PagesListProps {
  pages: CrawlPage[];
  selectedPage: CrawlPage | null;
  onPageSelect: (page: CrawlPage) => void;
}

const PagesList: React.FC<PagesListProps> = ({
  pages,
  selectedPage,
  onPageSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPages = searchTerm
    ? pages.filter(page => 
        page.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pages;
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar páginas..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="mt-2 space-y-2">
        <p className="text-sm text-muted-foreground">
          {filteredPages.length} {filteredPages.length === 1 ? 'página' : 'páginas'} encontradas
        </p>
        
        <div className="max-h-[500px] overflow-y-auto pr-2">
          {filteredPages.length > 0 ? (
            filteredPages.map(page => (
              <div
                key={page.id}
                onClick={() => onPageSelect(page)}
                className={`
                  p-3 border rounded-md mb-2 cursor-pointer hover:bg-accent/50 transition-colors
                  ${selectedPage?.id === page.id ? 'border-primary bg-primary/10' : 'border-border'}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-medium truncate max-w-[250px]">
                      {page.title || page.url}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                      {page.url}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <Badge 
                      variant={page.status_code >= 200 && page.status_code < 300 ? 'outline' : 'destructive'}
                      className={
                        page.status_code >= 200 && page.status_code < 300
                          ? 'bg-green-100 text-green-800'
                          : ''
                      }
                    >
                      {page.status_code}
                    </Badge>
                    
                    {(page.issues_count && page.issues_count > 0) && (
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
                        {page.issues_count} {page.issues_count === 1 ? 'problema' : 'problemas'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No se encontraron páginas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagesList;
