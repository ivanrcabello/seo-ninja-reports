
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrawlResult } from '@/services/seo-crawler/types';
import CrawlerDetailPage from './detail/CrawlerDetailPage';

interface CrawlerDetailProps {
  clientId: string;
  crawl?: CrawlResult;
  onBack?: () => void;
}

const CrawlerDetail: React.FC<CrawlerDetailProps> = ({ 
  clientId, 
  crawl, 
  onBack 
}) => {
  const navigate = useNavigate();
  const { crawlId: paramCrawlId } = useParams<{ crawlId: string }>();
  
  // Usar el ID del crawl de los props si está disponible, de lo contrario usar el de la URL
  const crawlId = crawl?.id || paramCrawlId;

  if (!crawlId) {
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
      crawlId={crawlId}
      onBack={handleBack}
    />
  );
};

export default CrawlerDetail;
