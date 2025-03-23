
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Client } from '@/types/client.types';
import { getCrawlResults, deleteCrawlResult, CrawlResult } from '@/services/seoCrawlerService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CrawlerDialog from './CrawlerDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CrawlerListProps {
  client: Client;
}

const CrawlerList: React.FC<CrawlerListProps> = ({ client }) => {
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCrawlerDialog, setShowCrawlerDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCrawlResults();
  }, []);

  const loadCrawlResults = async () => {
    try {
      setIsLoading(true);
      const results = await getCrawlResults(client.id);
      setCrawlResults(results || []);
    } catch (error) {
      console.error('Error al cargar resultados de crawl:', error);
      toast.error('Error al cargar resultados de análisis SEO');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResult = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteCrawlResult(id);
      setCrawlResults(prev => prev.filter(r => r.id !== id));
      toast.success('Análisis eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar análisis:', error);
      toast.error('Error al eliminar análisis');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleViewResult = (id: string) => {
    navigate(`/clients/${client.id}/seo-crawler/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Análisis SEO Técnico para {client.name}</h3>
        <Button onClick={() => setShowCrawlerDialog(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Nuevo Análisis
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : crawlResults.length > 0 ? (
        <div className="space-y-3">
          {crawlResults.map((result) => (
            <div 
              key={result.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <h4 className="font-medium flex items-center">
                    {result.domain}
                  </h4>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(new Date(result.crawl_date), 'd MMMM yyyy, HH:mm', { locale: es })}
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                        : result.status === 'processing'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                    }`}>
                      {result.status === 'completed' ? 'Completado' : result.status === 'processing' ? 'Procesando' : 'Error'}
                    </span>
                    <div className="mx-2 text-muted-foreground">•</div>
                    <span>{result.pages_crawled} páginas analizadas</span>
                    <div className="mx-2 text-muted-foreground">•</div>
                    <span>{result.issues_count} problemas encontrados</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewResult(result.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1.5" />
                    Ver detalles
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={!!isDeleting}
                      >
                        {isDeleting === result.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar análisis?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El análisis y todos sus datos serán eliminados permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteResult(result.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-card">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ExternalLink className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No hay análisis SEO</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Realiza tu primer análisis SEO técnico para detectar problemas en el sitio web de este cliente.
          </p>
          <Button onClick={() => setShowCrawlerDialog(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Iniciar Análisis SEO
          </Button>
        </div>
      )}

      <CrawlerDialog
        client={client}
        open={showCrawlerDialog}
        onOpenChange={setShowCrawlerDialog}
        onSuccess={loadCrawlResults}
      />
    </div>
  );
};

export default CrawlerList;
