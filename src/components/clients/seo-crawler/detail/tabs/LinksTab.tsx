
import React from 'react';
import { CrawlLink, CrawlPage } from '@/services/seo-crawler/types';
import { Loader2 } from 'lucide-react';
import LinksTabContent from './LinksTabContent';

interface LinksTabProps {
  pageLinks: CrawlLink[];
  selectedPage: CrawlPage | null;
  pages: CrawlPage[];
  onPageSelect: (page: CrawlPage) => void;
  isLoading?: boolean;
}

const LinksTab: React.FC<LinksTabProps> = ({ 
  pageLinks, 
  selectedPage,
  pages,
  onPageSelect,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <LinksTabContent 
      pageLinks={pageLinks} 
      selectedPage={selectedPage}
      pages={pages}
      onPageSelect={onPageSelect}
    />
  );
};

export default LinksTab;
