
import React from 'react';
import { Button } from '@/components/ui/button';

interface CrawlerHeaderProps {
  onNewCrawl: () => void;
}

const CrawlerHeader: React.FC<CrawlerHeaderProps> = ({ onNewCrawl }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4">
      <h2 className="text-lg font-semibold">Análisis SEO técnico</h2>
      <Button onClick={onNewCrawl}>
        Nuevo análisis
      </Button>
    </div>
  );
};

export default CrawlerHeader;
