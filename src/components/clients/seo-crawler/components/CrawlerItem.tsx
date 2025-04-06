
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { CrawlResult } from '@/services/seo-crawler/types';
import CrawlStatusBadge from './CrawlStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, LineChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CrawlerItemProps {
  crawl: CrawlResult;
  clientId: string;
  onDelete?: (crawlId: string) => void;
}

const CrawlerItem: React.FC<CrawlerItemProps> = ({ crawl, clientId, onDelete }) => {
  // Get the creation date, using any available timestamp (created_at, inserted_at, or updated_at)
  const creationDate = crawl.created_at || crawl.inserted_at || crawl.updated_at;
  
  return (
    <Card className="overflow-hidden hover:border-primary/20 transition-colors">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium text-lg break-all mr-2 leading-tight">
                {crawl.domain || crawl.url}
              </h3>
              <CrawlStatusBadge status={crawl.status} />
            </div>
            <p className="text-muted-foreground text-sm mt-1.5">
              {crawl.status === 'completed' ? (
                <span>
                  {crawl.pages_crawled} {crawl.pages_crawled === 1 ? 'página' : 'páginas'} analizadas
                  {crawl.total_issues ? ` • ${crawl.total_issues} problemas` : ''}
                  {crawl.completed_at && creationDate ? 
                    ` • Tiempo: ${formatDistance(
                      new Date(crawl.completed_at),
                      new Date(creationDate),
                      { locale: es }
                    )}` : 
                    ''
                  }
                </span>
              ) : crawl.status === 'processing' ? (
                <span>{crawl.pages_crawled ? `${crawl.pages_crawled} páginas analizadas hasta ahora` : 'Analizando...'}</span>
              ) : crawl.status === 'failed' ? (
                <span className="text-destructive">Error: {crawl.error_message || 'Error desconocido'}</span>
              ) : (
                <span>En espera para comenzar</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-end md:self-center">
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  if (onDelete) onDelete(crawl.id);
                }}
              >
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            )}
            
            <Link to={`/clients/${clientId}/crawler/${crawl.id}`}>
              <Button variant="outline" className="gap-1.5">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Ver análisis</span>
                <ArrowRight className="h-4 w-4 sm:hidden" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrawlerItem;
