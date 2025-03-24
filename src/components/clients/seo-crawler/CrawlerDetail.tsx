
// This file now passes the props to the new refactored component
import React from 'react';
import { CrawlResult } from '@/services/seo-crawler';
import CrawlerDetailPage from './detail/CrawlerDetailPage';

interface CrawlerDetailProps {
  clientId: string;
  crawl: CrawlResult;
  onBack: () => void;
}

const CrawlerDetail: React.FC<CrawlerDetailProps> = ({ 
  clientId, 
  crawl, 
  onBack 
}) => {
  return (
    <CrawlerDetailPage 
      clientId={clientId}
      crawlId={crawl.id}
      onBack={onBack}
    />
  );
};

export default CrawlerDetail;
