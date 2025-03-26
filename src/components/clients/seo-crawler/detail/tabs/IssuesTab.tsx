
import React from 'react';
import { CrawlIssue, CrawlPage } from '@/services/seo-crawler/types';
import { Loader2 } from 'lucide-react';
import IssuesTabContent from './IssuesTabContent';

interface IssuesTabProps {
  issuesByType: Record<string, CrawlIssue[]>;
  pageIssues: CrawlIssue[];
  selectedPage: CrawlPage | null;
  isLoading?: boolean;
}

const IssuesTab: React.FC<IssuesTabProps> = ({ 
  issuesByType, 
  pageIssues,
  selectedPage,
  isLoading = false 
}) => {
  // Log to help debug issues
  console.log("IssuesTab - issuesByType keys:", Object.keys(issuesByType));
  console.log("IssuesTab - total issues in issuesByType:", Object.values(issuesByType).flat().length);
  console.log("IssuesTab - pageIssues length:", pageIssues.length);
  console.log("IssuesTab - selectedPage:", selectedPage?.id, selectedPage?.url);
  
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
      pageIssues={pageIssues} 
      selectedPage={selectedPage}
    />
  );
};

export default IssuesTab;
