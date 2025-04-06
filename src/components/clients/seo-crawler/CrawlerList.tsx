
import React, { useEffect, useState } from 'react';
import { Client } from '@/types/client.types';
import { toast } from 'sonner';
import { getCrawlResults, deleteCrawlRecord } from '@/services/seo-crawler/api';
import { CrawlResult } from '@/services/seo-crawler/types';
import CrawlerDialog from './CrawlerDialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CrawlerHeader from './components/CrawlerHeader';
import CrawlerSearch from './components/CrawlerSearch';
import CrawlerItem from './components/CrawlerItem';
import CrawlerEmptyState from './components/CrawlerEmptyState';
import CrawlerLoadingState from './components/CrawlerLoadingState';
import DeleteCrawlDialog from './components/DeleteCrawlDialog';

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

  const handleDeleteCrawl = (crawlId: string) => {
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

  return (
    <div className="space-y-4">
      <CrawlerHeader 
        onNewCrawl={() => setShowCrawlerDialog(true)} 
      />

      <CrawlerSearch 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {loading ? (
        <CrawlerLoadingState />
      ) : filteredCrawls.length > 0 ? (
        <div className="space-y-2 mt-2">
          {filteredCrawls.map((crawl) => (
            <CrawlerItem
              key={crawl.id}
              crawl={crawl}
              clientId={client.id}
              onDelete={handleDeleteCrawl}
            />
          ))}
        </div>
      ) : (
        <CrawlerEmptyState 
          searchTerm={searchTerm} 
          onClearSearch={() => setSearchTerm('')} 
        />
      )}

      {showCrawlerDialog && (
        <CrawlerDialog
          clientId={client.id}
          open={showCrawlerDialog}
          onOpenChange={setShowCrawlerDialog}
          onSuccess={handleCrawlCompleted}
        />
      )}

      <DeleteCrawlDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        deleting={deleting}
      />
    </div>
  );
};

export default CrawlerList;
