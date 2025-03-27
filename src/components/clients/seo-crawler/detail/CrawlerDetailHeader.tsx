
import React from 'react';
import { CrawlResult } from '@/services/seo-crawler/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileBarChart, Eye, EyeOff } from 'lucide-react';

interface CrawlerDetailHeaderProps {
  crawl: CrawlResult;
  onBack?: () => void;
  showReport?: () => void;
  isReportShown?: boolean;
}

const CrawlerDetailHeader: React.FC<CrawlerDetailHeaderProps> = ({ 
  crawl, 
  onBack,
  showReport,
  isReportShown
}) => {
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Handle back button click explicitly using window.history
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            className="mr-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{crawl.domain}</h1>
          <Badge className={getStatusColor(crawl.status)}>
            {crawl.status.charAt(0).toUpperCase() + crawl.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {showReport && (
            <Button 
              variant="outline" 
              onClick={showReport}
              className="flex items-center gap-2"
            >
              {isReportShown ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Ver detalles</span>
                </>
              ) : (
                <>
                  <FileBarChart className="h-4 w-4" />
                  <span>Ver informe</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-sm">
          <span className="text-muted-foreground">URL:</span>{' '}
          <a 
            href={crawl.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline break-all"
          >
            {crawl.url}
          </a>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Inicio:</span>{' '}
          <span>{formatDate(crawl.started_at)}</span>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Finalización:</span>{' '}
          <span>{formatDate(crawl.completed_at)}</span>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Páginas:</span>{' '}
          <span>{crawl.pages_crawled} de {crawl.total_pages}</span>
        </div>
      </div>
    </div>
  );
};

export default CrawlerDetailHeader;

