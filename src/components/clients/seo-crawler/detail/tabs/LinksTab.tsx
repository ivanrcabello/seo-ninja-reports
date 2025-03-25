
import React from 'react';
import { CrawlLink, CrawlPage } from '@/services/seo-crawler/types';
import LinksTabContent from './LinksTabContent';
import { Loader2 } from 'lucide-react';

interface LinksTabProps {
  pageLinks: CrawlLink[];
  selectedPage: CrawlPage | null;
  isLoading?: boolean;
}

const LinksTab: React.FC<LinksTabProps> = ({ 
  pageLinks, 
  selectedPage,
  isLoading = false
}) => {
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <LinksTabContent 
          pageLinks={pageLinks} 
          selectedPage={selectedPage} 
        />
      )}
    </div>
  );
};

export default LinksTab;
