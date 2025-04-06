
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrawlResult } from '@/services/seo-crawler/types';
import CrawlerDetailPage from './detail/CrawlerDetailPage';
import { toast } from 'sonner';
import { getCrawlResult } from '@/services/seo-crawler/api';
import { Loader2 } from 'lucide-react';

interface CrawlerDetailProps {
  clientId: string;
  crawlId?: string;
  crawl?: CrawlResult;
  onBack?: () => void;
}

const CrawlerDetail: React.FC<CrawlerDetailProps> = ({ 
  clientId, 
  crawlId: propsCrawlId,
  crawl: initialCrawl, 
  onBack 
}) => {
  const navigate = useNavigate();
  const { crawlId: paramCrawlId } = useParams<{ crawlId: string }>();
  const [crawl, setCrawl] = useState<CrawlResult | null>(initialCrawl || null);
  const [isLoading, setIsLoading] = useState(!initialCrawl);
  
  // Use the crawlId from props if available, otherwise use the one from URL params
  const effectiveCrawlId = propsCrawlId || paramCrawlId;

  useEffect(() => {
    if (!effectiveCrawlId || initialCrawl) {
      return;
    }

    const loadCrawl = async () => {
      try {
        setIsLoading(true);
        console.log("Loading crawl data for ID:", effectiveCrawlId);
        const result = await getCrawlResult(effectiveCrawlId);
        console.log("Crawl data loaded:", result);
        setCrawl(result);
      } catch (error) {
        console.error("Error loading crawl data:", error);
        toast.error("Error al cargar los datos del análisis");
      } finally {
        setIsLoading(false);
      }
    };

    loadCrawl();
  }, [effectiveCrawlId, initialCrawl]);

  if (!effectiveCrawlId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">No se ha especificado un ID de análisis</p>
        <button 
          className="text-primary hover:underline" 
          onClick={() => navigate(`/clients/${clientId}`)}
        >
          Volver a la lista de análisis
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="text-muted-foreground">Cargando datos del análisis...</p>
      </div>
    );
  }

  if (!crawl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">No se ha encontrado el análisis</p>
        <button 
          className="text-primary hover:underline" 
          onClick={() => navigate(`/clients/${clientId}`)}
        >
          Volver a la lista de análisis
        </button>
      </div>
    );
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(`/clients/${clientId}`);
    }
  };

  return (
    <CrawlerDetailPage 
      clientId={clientId}
      crawlId={effectiveCrawlId}
      onBack={handleBack}
    />
  );
};

export default CrawlerDetail;
