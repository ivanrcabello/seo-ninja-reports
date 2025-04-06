
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrawlResult, CrawlPage, CrawlIssue, CrawlHeading } from '@/services/seo-crawler/types';
import OverviewTab from './tabs/OverviewTab';
import PagesTab from './tabs/PagesTab';
import IssuesTab from './tabs/IssuesTab';
import HeadingsTab from './tabs/HeadingsTab';

interface CrawlerReportViewProps {
  crawlResult: CrawlResult;
  pages: CrawlPage[];
  issues: CrawlIssue[];
  headings?: CrawlHeading[];
}

const CrawlerReportView: React.FC<CrawlerReportViewProps> = ({ 
  crawlResult,
  pages = [],
  issues = [],
  headings = []
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="pages">Páginas ({pages.length})</TabsTrigger>
          <TabsTrigger value="issues">Problemas ({issues.length})</TabsTrigger>
          <TabsTrigger value="headings">Encabezados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 pt-4">
          <OverviewTab 
            crawlResult={crawlResult}
            pages={pages}
            issues={issues}
            headings={headings}
          />
        </TabsContent>
        
        <TabsContent value="pages" className="space-y-6 pt-4">
          <PagesTab pages={pages} />
        </TabsContent>
        
        <TabsContent value="issues" className="space-y-6 pt-4">
          <IssuesTab issues={issues} />
        </TabsContent>
        
        <TabsContent value="headings" className="space-y-6 pt-4">
          <HeadingsTab headings={headings} pages={pages} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrawlerReportView;
