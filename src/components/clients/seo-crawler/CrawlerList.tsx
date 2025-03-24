
import React, { useEffect, useState } from 'react';
import { Client } from '@/types/client.types';
import { toast } from 'sonner';
import { 
  getCrawlResults, 
  deleteCrawlRecord
} from '@/services/seo-crawler/api';
import { CrawlResult } from '@/services/seo-crawler/types';
import CrawlerDialog from './CrawlerDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Trash2, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';

interface CrawlerListProps {
  client: Client;
}

const CrawlerList: React.FC<CrawlerListProps> = ({ client }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [crawls, setCrawls] = useState<CrawlResult[]>([]);
  const [filteredCrawls, setFilteredCrawls] = useState<CrawlResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCrawlerDialog, setShowCrawlerDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [crawlToDelete, setCrawlToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCrawls();
  }, [client.id]);

  const loadCrawls = async () => {
    try {
      setLoading(true);
      const results = await getCrawlResults(client.id);
      setCrawls(results);
      setFilteredCrawls(results);
    } catch (error) {
      console.error("Error loading crawl results:", error);
      toast.error("Error al cargar los análisis SEO");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = crawls.filter(crawl => 
        crawl.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCrawls(filtered);
    } else {
      setFilteredCrawls(crawls);
    }
  }, [searchTerm, crawls]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenCrawl = (crawl: CrawlResult) => {
    // Navegamos a la ruta del detalle
    navigate(`/clients/${client.id}/crawl/${crawl.id}`);
  };

  const handleDeleteCrawl = (crawlId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCrawlToDelete(crawlId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!crawlToDelete) return;
    
    try {
      setDeleting(true);
      await deleteCrawlRecord(crawlToDelete);
      setCrawls(prevCrawls => prevCrawls.filter(crawl => crawl.id !== crawlToDelete));
      toast.success("Análisis eliminado correctamente");
    } catch (error) {
      console.error("Error deleting crawl:", error);
      toast.error("Error al eliminar el análisis");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setCrawlToDelete(null);
    }
  };

  const handleCrawlCompleted = () => {
    loadCrawls();
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4">
        <h2 className="text-lg font-semibold">Análisis SEO técnico</h2>
        <Button onClick={() => setShowCrawlerDialog(true)}>
          Nuevo análisis
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por dominio..."
          className="pl-8"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredCrawls.length > 0 ? (
        <div className="space-y-2 mt-2">
          {filteredCrawls.map((crawl) => (
            <div
              key={crawl.id}
              onClick={() => handleOpenCrawl(crawl)}
              className="flex items-center justify-between bg-background/50 hover:bg-primary/5 border border-border rounded-lg p-3 cursor-pointer transition-colors"
            >
              <div className="flex flex-col">
                <div className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                  {crawl.domain}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                  <span>{format(new Date(crawl.crawl_date), 'd MMM yyyy', { locale: es })}</span>
                  {getCrawlStatusBadge(crawl.status)}
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => handleDeleteCrawl(crawl.id, e)}
                  className="mr-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            {searchTerm ? "No se encontraron análisis que coincidan con la búsqueda" : "No hay análisis SEO realizados todavía"}
          </p>
          {searchTerm && (
            <Button 
              variant="link" 
              onClick={() => setSearchTerm('')}
            >
              Mostrar todos los análisis
            </Button>
          )}
        </div>
      )}

      {showCrawlerDialog && (
        <CrawlerDialog
          client={client}
          open={showCrawlerDialog}
          onOpenChange={setShowCrawlerDialog}
          onClose={() => setShowCrawlerDialog(false)}
          onCrawlCompleted={handleCrawlCompleted}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este análisis SEO?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este análisis y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CrawlerList;
