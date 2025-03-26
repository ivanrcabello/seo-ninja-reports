
import React from 'react';
import { ArrowLeft, Calendar, Clock, AlertCircle, CheckCircle, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrawlResult } from '@/services/seo-crawler/types';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import BlurredCard from '@/components/ui/BlurredCard';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RetryButton from './RetryButton';

interface CrawlerHeaderProps {
  clientId: string;
  crawlResult: CrawlResult;
  onBack: () => void;
}

const CrawlerHeader: React.FC<CrawlerHeaderProps> = ({ 
  clientId, 
  crawlResult, 
  onBack 
}) => {
  const getStatusBadge = () => {
    switch (crawlResult.status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completado
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Procesando
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Fallido
          </Badge>
        );
      case 'queued':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En cola
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{crawlResult.status}</Badge>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
  };
  
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  return (
    <BlurredCard>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <Button variant="ghost" onClick={onBack} className="flex items-center -ml-4 p-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              <RetryButton 
                crawlId={crawlResult.id} 
                status={crawlResult.status} 
              />
            </div>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Link className="h-5 w-5 mr-2 text-primary" />
              Análisis SEO: {crawlResult.domain}
            </h1>
            <div className="mt-1 text-muted-foreground">
              <a 
                href={crawlResult.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {crawlResult.url}
              </a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm mt-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Iniciado:</span>
              <span>{formatDate(crawlResult.started_at)}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({getTimeAgo(crawlResult.started_at)})
              </span>
            </div>
            
            {crawlResult.completed_at && (
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Completado:</span>
                <span>{formatDate(crawlResult.completed_at)}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({getTimeAgo(crawlResult.completed_at)})
                </span>
              </div>
            )}
            
            {crawlResult.total_time_seconds !== undefined && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Tiempo total:</span>
                <span>
                  {crawlResult.total_time_seconds > 60 
                    ? `${Math.floor(crawlResult.total_time_seconds / 60)} minutos ${crawlResult.total_time_seconds % 60} segundos` 
                    : `${crawlResult.total_time_seconds} segundos`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </BlurredCard>
  );
};

export default CrawlerHeader;
