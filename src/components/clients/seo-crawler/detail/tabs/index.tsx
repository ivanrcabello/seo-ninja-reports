
import IssuesTab from './IssuesTab';
import PagesTab from './PagesTab';
import LinksTab from './LinksTab';
import HeadingsTab from './HeadingsTab';
import React from 'react';
import { CrawlResult } from '@/services/seo-crawler/types';

export { IssuesTab, PagesTab, LinksTab, HeadingsTab };

interface CrawlerTabContentProps {
  activeTab: string;
  crawl: CrawlResult;
  clientId: string;
}

export const CrawlerTabContent: React.FC<CrawlerTabContentProps> = ({ 
  activeTab, 
  crawl, 
  clientId 
}) => {
  switch (activeTab) {
    case 'issues':
      return <IssuesTab crawl={crawl} />;
    case 'pages':
      return <PagesTab crawl={crawl} />;
    case 'links':
      return <LinksTab crawl={crawl} />;
    case 'headings':
      return <HeadingsTab crawl={crawl} />;
    default:
      return <div>Select a tab to view content</div>;
  }
};
