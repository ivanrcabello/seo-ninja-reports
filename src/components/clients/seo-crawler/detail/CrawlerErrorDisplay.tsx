
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { CrawlResult } from '@/services/seo-crawler/types';
import { restartCrawl } from '@/services/seo-crawler/api';
import { toast } from 'sonner';

interface CrawlerErrorDisplayProps {
  crawl: CrawlResult;
  onRefresh: () => void;
}

const CrawlerErrorDisplay: React.FC<CrawlerErrorDisplayProps> = ({ crawl, onRefresh }) => {
  const [isRestarting, setIsRestarting] = React.useState(false);

  const handleRestartCrawl = async () => {
    try {
      setIsRestarting(true);
      await restartCrawl(crawl.id);
      toast.success('Análisis reiniciado correctamente');
      onRefresh();
    } catch (error) {
      console.error('Error restarting crawl:', error);
      toast.error('Error al reiniciar el análisis');
    } finally {
      setIsRestarting(false);
    }
  };

  const isRlsError = crawl.error_message?.toLowerCase().includes('row level security') || 
                     crawl.error_message?.toLowerCase().includes('rls');

  return (
    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-400">
                Error en el análisis
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {crawl.error_message || 'Se produjo un error durante el análisis'}
              </p>
              
              {isRlsError && (
                <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-300">
                  <p className="font-semibold mb-1">Error de permisos de base de datos (RLS)</p>
                  <p>
                    Este error indica un problema con los permisos de Row Level Security en Supabase.
                    Es necesario configurar correctamente las políticas RLS para las tablas del crawler.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
              onClick={handleRestartCrawl}
              disabled={isRestarting}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reintentar análisis</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrawlerErrorDisplay;
