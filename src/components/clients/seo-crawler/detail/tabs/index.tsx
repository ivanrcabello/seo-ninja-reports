
import React from 'react';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink, CrawlHeading } from '@/services/seo-crawler/types';
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
  pages?: CrawlPage[];
  selectedPage?: CrawlPage | null;
  pageIssues?: CrawlIssue[];
  pageLinks?: CrawlLink[];
  pageHeadings?: CrawlHeading[];
  issuesByType?: Record<string, CrawlIssue[]>;
  issuesBySeverity?: Record<string, CrawlIssue[]>;
  onPageSelect?: (page: CrawlPage) => void;
  isLoading?: boolean;
}

export const CrawlerTabContent: React.FC<CrawlerTabContentProps> = ({ 
  activeTab, 
  crawl,
  clientId,
  pages = [],
  selectedPage = null,
  pageIssues = [],
  pageLinks = [],
  pageHeadings = [],
  issuesByType = {},
  issuesBySeverity = {},
  onPageSelect = () => {},
  isLoading = false
}) => {
  switch (activeTab) {
    case 'issues':
      return (
        <IssuesTabComponent 
          issuesByType={issuesByType}
          issuesBySeverity={issuesBySeverity}
          pageIssues={pageIssues}
          selectedPage={selectedPage}
          isLoading={isLoading}
        />
      );
    case 'pages':
      return (
        <PagesTabComponent 
          pages={pages}
          selectedPage={selectedPage}
          onPageSelect={onPageSelect}
          isLoading={isLoading}
          pageIssues={pageIssues}
          pageLinks={pageLinks}
        />
      );
    case 'links':
      return (
        <LinksTabComponent 
          pageLinks={pageLinks}
          selectedPage={selectedPage}
          isLoading={isLoading}
          pages={pages}
          onPageSelect={onPageSelect}
        />
      );
    case 'headings':
      return (
        <HeadingsTabComponent 
          pageHeadings={pageHeadings}
          selectedPage={selectedPage}
          isLoading={isLoading}
        />
      );
    default:
      return <div>Select a tab to view content</div>;
  }
};
