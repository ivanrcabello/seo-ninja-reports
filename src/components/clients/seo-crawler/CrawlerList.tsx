
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/types/client.types';
import { getCrawlResults, deleteCrawlResult, CrawlResult } from '@/services/seoCrawlerService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Loader2, Plus, Trash2, ArrowUpRight } from 'lucide-react';
import CrawlerDialog from './CrawlerDialog';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import BlurredCard from '@/components/ui/BlurredCard';

interface CrawlerListProps {
  client: Client;
}

const CrawlerList: React.FC<CrawlerListProps> = ({ client }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [crawlResults, setCrawlResults] = useState<CrawlResult[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCrawlId, setSelectedCrawlId] = useState<string | null>(null);

  const loadCrawlResults = useCallback(async () => {
    try {
      setIsLoading(true);
      const results = await getCrawlResults(client.id);
      setCrawlResults(results || []);
    } catch (error) {
      toast.error('Error al cargar los análisis SEO');
    } finally {
      setIsLoading(false);
    }
  }, [client.id]);

  useEffect(() => {
    loadCrawlResults();
  }, [loadCrawlResults]);

  const handleDeleteClick = (id: string) => {
    setSelectedCrawlId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCrawlId) return;
    
    try {
      await deleteCrawlResult(selectedCrawlId);
      setCrawlResults(crawlResults.filter(result => result.id !== selectedCrawlId));
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Error al eliminar el análisis');
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/clients/${client.id}/seo-crawler/${id}`);
  };

  return (
    <>
      <BlurredCard>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Análisis SEO Técnico</CardTitle>
            <CardDescription>
              Análisis automatizado de problemas técnicos SEO
            </CardDescription>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Análisis
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : crawlResults.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dominio</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Páginas</TableHead>
                  <TableHead>Problemas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crawlResults.map((result, index) => (
                  <AnimatedContainer key={result.id} animation="fade" delay={index * 100}>
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(result.id)}
                    >
                      <TableCell className="font-medium">{result.domain}</TableCell>
                      <TableCell>
                        {format(new Date(result.crawl_date), 'd MMM yyyy, HH:mm', { locale: es })}
                      </TableCell>
                      <TableCell>{result.pages_crawled}</TableCell>
                      <TableCell>
                        <span className={result.issues_count > 0 ? 'text-orange-500 font-medium' : ''}>
                          {result.issues_count}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          result.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : result.status === 'processing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.status === 'completed' 
                            ? 'Completado' 
                            : result.status === 'processing'
                            ? 'Procesando'
                            : 'Error'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(result.id);
                            }}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(result.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </AnimatedContainer>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No hay análisis SEO</h3>
              <p className="text-muted-foreground mb-6">
                Inicia un nuevo análisis SEO técnico para detectar problemas en el sitio web.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Iniciar Análisis SEO
              </Button>
            </div>
          )}
        </CardContent>
      </BlurredCard>

      <CrawlerDialog
        client={client}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadCrawlResults}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el análisis SEO y todos sus datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CrawlerList;
