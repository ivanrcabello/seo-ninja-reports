
import React from 'react';
import { CrawlPage, CrawlIssue } from '@/services/seo-crawler';
import BlurredCard from '@/components/ui/BlurredCard';
import PagesList from './PagesList';
import PageDetail from './PageDetail';

interface PagesTabContentProps {
  pages: CrawlPage[];
  selectedPage: CrawlPage | null;
  pageIssues: CrawlIssue[];
  onPageSelect: (page: CrawlPage) => void;
}

const PagesTabContent: React.FC<PagesTabContentProps> = ({
  pages,
  selectedPage,
  pageIssues,
  onPageSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BlurredCard className="md:col-span-1">
        <PagesList 
          pages={pages}
          selectedPage={selectedPage}
          onPageSelect={onPageSelect}
        />
      </BlurredCard>
      
      <BlurredCard className="md:col-span-2">
        {selectedPage ? (
          <PageDetail
            page={selectedPage}
            issues={pageIssues}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Selecciona una página</h3>
              <p className="text-muted-foreground">
                Haz clic en una página en la lista para ver sus detalles
              </p>
            </div>
          </div>
        )}
      </BlurredCard>
    </div>
  );
};

export default PagesTabContent;
