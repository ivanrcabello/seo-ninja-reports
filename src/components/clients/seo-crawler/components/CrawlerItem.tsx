
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { CrawlResult } from '@/services/seo-crawler/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BarChart2, Calendar, ExternalLink, Trash2 } from 'lucide-react';

interface CrawlerItemProps {
  crawl: CrawlResult;
  clientId: string;
  onDelete: (crawlId: string) => void;
}

const CrawlerItem = ({ crawl, clientId, onDelete }: CrawlerItemProps) => {
  // Format date using date-fns
  const formattedDate = crawl.inserted_at
    ? formatDistanceToNow(new Date(crawl.inserted_at), { addSuffix: true, locale: es })
    : 'Fecha desconocida';

  const statusBadgeColor = 
    crawl.status === 'completed' ? 'bg-green-100 text-green-800' :
    crawl.status === 'failed' ? 'bg-red-100 text-red-800' :
    'bg-blue-100 text-blue-800';
  
  const statusText = 
    crawl.status === 'completed' ? 'Completado' :
    crawl.status === 'failed' ? 'Error' :
    'En progreso';

  return (
    <div className="bg-card border rounded-lg p-4 hover:border-primary/20 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <h3 className="font-medium text-lg">{crawl.domain}</h3>
            <Badge variant="outline" className={`${statusBadgeColor} border-0`}>
              {statusText}
            </Badge>
          </div>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
            {crawl.pages_count && (
              <span className="ml-3">
                {crawl.pages_count} páginas analizadas
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {crawl.status === 'completed' ? (
            <Link to={`/clients/${clientId}/crawler/${crawl.id}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Ver resultados
              </Button>
            </Link>
          ) : crawl.status === 'failed' ? (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm">Error en el análisis</span>
            </div>
          ) : (
            <div className="flex items-center text-blue-600">
              <div className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mr-1.5" />
              <span className="text-sm">Analizando...</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(crawl.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrawlerItem;
