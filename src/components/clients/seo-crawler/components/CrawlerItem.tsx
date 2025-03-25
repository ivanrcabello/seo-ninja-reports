
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ChevronRight } from 'lucide-react';
import { CrawlResult } from '@/services/seo-crawler/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CrawlerItemProps {
  crawl: CrawlResult;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const CrawlerItem: React.FC<CrawlerItemProps> = ({ crawl, onClick, onDelete }) => {
  const formatCrawlDate = (crawl: CrawlResult) => {
    const dateStr = crawl.crawl_date || crawl.started_at || crawl.inserted_at;
    return format(new Date(dateStr), 'd MMM yyyy', { locale: es });
  };

  const getCrawlStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-500">Completado</Badge>;
    } else if (status === 'processing') {
      return <Badge className="bg-orange-500">Procesando</Badge>;
    } else if (status === 'pending') {
      return <Badge className="bg-blue-500">Pendiente</Badge>;
    } else if (status === 'error') {
      return <Badge variant="destructive">Error</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between bg-background/50 hover:bg-primary/5 border border-border rounded-lg p-3 cursor-pointer transition-colors"
    >
      <div className="flex flex-col">
        <div className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
          {crawl.domain}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
          <span>{formatCrawlDate(crawl)}</span>
          {getCrawlStatusBadge(crawl.status)}
        </div>
      </div>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="mr-1 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export default CrawlerItem;
