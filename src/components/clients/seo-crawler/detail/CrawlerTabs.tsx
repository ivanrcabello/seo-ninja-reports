
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PagesTab from './tabs/PagesTab';
import IssuesTab from './tabs/IssuesTab';
import LinksTab from './tabs/LinksTab';
import HeadingsTab from './tabs/HeadingsTab';
import { CrawlPage, CrawlIssue, CrawlLink, CrawlHeading } from '@/services/seo-crawler/types';

interface CrawlerTabsProps {
  pages: CrawlPage[];
  selectedPage: CrawlPage | null;
  pageIssues: CrawlIssue[];
  pageLinks: CrawlLink[];
  pageHeadings: CrawlHeading[];
  issuesByType: Record<string, CrawlIssue[]>;
  onPageSelect: (page: CrawlPage) => void;
  isLoadingPageData?: boolean;
}

const CrawlerTabs: React.FC<CrawlerTabsProps> = ({
  pages,
  selectedPage,
  pageIssues,
  pageLinks,
  pageHeadings = [],
  issuesByType,
  onPageSelect,
  isLoadingPageData = false
}) => {
  return (
    <Tabs defaultValue="pages" className="w-full">
      <TabsList className="grid grid-cols-4 w-full md:w-[500px]">
        <TabsTrigger value="pages">Páginas</TabsTrigger>
        <TabsTrigger value="issues">Problemas</TabsTrigger>
        <TabsTrigger value="links">Enlaces</TabsTrigger>
        <TabsTrigger value="headings">Encabezados</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pages" className="mt-6">
        <PagesTab 
          pages={pages} 
          selectedPage={selectedPage} 
          onPageSelect={onPageSelect}
          isLoading={isLoadingPageData}
          pageIssues={pageIssues}
          pageLinks={pageLinks}
        />
      </TabsContent>
      
      <TabsContent value="issues" className="mt-6">
        <IssuesTab 
          issuesByType={issuesByType} 
          pageIssues={pageIssues} 
          selectedPage={selectedPage}
          isLoading={isLoadingPageData}
        />
      </TabsContent>
      
      <TabsContent value="links" className="mt-6">
        <LinksTab 
          pageLinks={pageLinks} 
          selectedPage={selectedPage}
          isLoading={isLoadingPageData}
          pages={pages}
          onPageSelect={onPageSelect}
        />
      </TabsContent>
      
      <TabsContent value="headings" className="mt-6">
        <HeadingsTab 
          pageHeadings={pageHeadings}
          selectedPage={selectedPage}
          isLoading={isLoadingPageData}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CrawlerTabs;
