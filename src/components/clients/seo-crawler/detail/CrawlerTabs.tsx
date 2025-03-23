
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrawlPage, CrawlIssue, CrawlLink } from '@/services/seo-crawler';
import IssuesTabContent from './tabs/IssuesTabContent';
import PagesTabContent from './tabs/PagesTabContent';

interface CrawlerTabsProps {
  pages: CrawlPage[];
  selectedPage: CrawlPage | null;
  pageIssues: CrawlIssue[];
  pageLinks?: CrawlLink[];
  issuesByType: Record<string, CrawlIssue[]>;
  onPageSelect: (page: CrawlPage) => void;
}

const CrawlerTabs: React.FC<CrawlerTabsProps> = ({
  pages,
  selectedPage,
  pageIssues,
  pageLinks = [],
  issuesByType,
  onPageSelect
}) => {
  return (
    <Tabs defaultValue="issues">
      <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
        <TabsTrigger value="issues">Problemas</TabsTrigger>
        <TabsTrigger value="pages">Páginas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="issues" className="mt-6">
        <IssuesTabContent issuesByType={issuesByType} />
      </TabsContent>
      
      <TabsContent value="pages" className="mt-6">
        <PagesTabContent 
          pages={pages}
          selectedPage={selectedPage}
          pageIssues={pageIssues}
          pageLinks={pageLinks}
          onPageSelect={onPageSelect}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CrawlerTabs;
