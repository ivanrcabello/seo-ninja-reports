
import React from 'react';
import { CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';
import IssuesTabContent from './IssuesTabContent';
import { Loader2 } from 'lucide-react';

interface IssuesTabProps {
  issuesByType: Record<string, CrawlIssue[]>;
  issuesBySeverity: Record<string, CrawlIssue[]>;
  pageIssues: CrawlIssue[];
  selectedPage: CrawlPage | null;
  isLoading?: boolean;
}

const IssuesTab: React.FC<IssuesTabProps> = ({
  issuesByType,
  issuesBySeverity,
  pageIssues,
  selectedPage,
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
    <IssuesTabContent
      issuesByType={issuesByType}
      issuesBySeverity={issuesBySeverity}
      pageIssues={pageIssues}
      selectedPage={selectedPage}
    />
  );
};

export default IssuesTab;
