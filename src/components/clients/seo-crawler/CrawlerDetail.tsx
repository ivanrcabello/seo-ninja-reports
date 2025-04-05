
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CrawlResult } from '@/services/seo-crawler/types';
import CrawlerDetailPage from './detail/CrawlerDetailPage';

interface CrawlerDetailProps {
  clientId: string;
  crawlId?: string;
  crawl?: CrawlResult;
  onBack?: () => void;
}

const CrawlerDetail: React.FC<CrawlerDetailProps> = ({ 
  clientId, 
  crawlId: propsCrawlId,
  crawl, 
  onBack 
}) => {
  const navigate = useNavigate();
  const { crawlId: paramCrawlId } = useParams<{ crawlId: string }>();
  
  // Use the crawlId from props if available, otherwise use the one from URL params
  const crawlId = propsCrawlId || paramCrawlId || crawl?.id;

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
