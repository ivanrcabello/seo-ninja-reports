
import React from 'react';
import { CrawlPage, CrawlIssue, CrawlLink } from '@/services/seo-crawler/types';
import PagesList from './PagesList';
import PageDetail from './PageDetail';
import { Loader2 } from 'lucide-react';

interface PagesTabProps {
  pages: CrawlPage[];
  selectedPage: CrawlPage | null;
  onPageSelect: (page: CrawlPage) => void;
  isLoading?: boolean;
  pageIssues?: CrawlIssue[];
  pageLinks?: CrawlLink[];
}

const PagesTab: React.FC<PagesTabProps> = ({ 
  pages, 
  selectedPage, 
  onPageSelect,
  isLoading = false,
  pageIssues = [],
  pageLinks = []
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <PagesList 
          pages={pages} 
          selectedPage={selectedPage} 
          onPageSelect={onPageSelect}
        />
      </div>
      <div className="md:col-span-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          selectedPage ? (
            <PageDetail 
              page={selectedPage} 
              issues={pageIssues}
              links={pageLinks}
            />
          ) : (
            <div className="border rounded-lg p-6 text-center text-muted-foreground">
              Selecciona una página para ver sus detalles
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PagesTab;
