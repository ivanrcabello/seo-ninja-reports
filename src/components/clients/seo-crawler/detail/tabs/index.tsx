
import React from 'react';
import { CrawlResult } from '@/services/seo-crawler/types';
import IssuesTabComponent from './IssuesTab';
import PagesTabComponent from './PagesTab';
import LinksTabComponent from './LinksTab';
import HeadingsTabComponent from './HeadingsTab';

// Export individual components
export const IssuesTab = IssuesTabComponent;
export const PagesTab = PagesTabComponent;
export const LinksTab = LinksTabComponent;
export const HeadingsTab = HeadingsTabComponent;

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
      return <IssuesTabComponent clientId={clientId} />;
    case 'pages':
      return <PagesTabComponent clientId={clientId} />;
    case 'links':
      return <LinksTabComponent clientId={clientId} />;
    case 'headings':
      return <HeadingsTabComponent clientId={clientId} />;
    default:
      return <div>Select a tab to view content</div>;
  }
};
