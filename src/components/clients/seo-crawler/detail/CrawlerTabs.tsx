
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CrawlPage, CrawlIssue, CrawlLink } from '@/services/seo-crawler/types';
import IssuesTab from './tabs/IssuesTab';
import PagesTab from './tabs/PagesTab';
import LinksTab from './tabs/LinksTab';

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
    <Tabs defaultValue="issues" className="w-full">
      <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-4">
        <TabsTrigger value="issues">Problemas</TabsTrigger>
        <TabsTrigger value="pages">Páginas</TabsTrigger>
        <TabsTrigger value="links">Enlaces</TabsTrigger>
      </TabsList>
      
      <TabsContent value="issues" className="mt-2">
        <IssuesTab 
          issuesByType={issuesByType} 
          pages={pages}
          onPageSelect={onPageSelect}
        />
      </TabsContent>
      
      <TabsContent value="pages" className="mt-2">
        <PagesTab 
          pages={pages}
          selectedPage={selectedPage}
          pageIssues={pageIssues}
          pageLinks={pageLinks}
          onPageSelect={onPageSelect}
        />
      </TabsContent>
      
      <TabsContent value="links" className="mt-2">
        <LinksTab 
          pages={pages}
          pageLinks={pageLinks}
          selectedPage={selectedPage}
          onPageSelect={onPageSelect}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CrawlerTabs;
