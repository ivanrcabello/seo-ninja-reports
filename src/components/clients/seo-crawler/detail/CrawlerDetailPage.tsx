
import React, { useState, useEffect } from 'react';
import { 
  fetchCrawlResult, 
  getCrawlPages, 
  fetchCrawlIssues,
  fetchCrawlLinks,
  CrawlResult, 
  CrawlPage, 
  CrawlIssue,
  CrawlLink
} from '@/services/seo-crawler';
import { toast } from 'sonner';

import CrawlerHeader from './CrawlerHeader';
import CrawlerSummary from './CrawlerSummary';
import CrawlerTabs from './CrawlerTabs';
import LoadingState from './LoadingState';
import NotFoundState from './NotFoundState';

interface CrawlerDetailPageProps {
  clientId: string;
  crawlId: string;
  onBack?: () => void;
}

const CrawlerDetailPage: React.FC<CrawlerDetailPageProps> = ({ 
  clientId, 
  crawlId,
  onBack
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [pages, setPages] = useState<CrawlPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CrawlPage | null>(null);
  const [pageIssues, setPageIssues] = useState<CrawlIssue[]>([]);
  const [pageLinks, setPageLinks] = useState<CrawlLink[]>([]);
  const [issuesByType, setIssuesByType] = useState<Record<string, CrawlIssue[]>>({});
  const [issuesBySeverity, setIssuesBySeverity] = useState<Record<string, CrawlIssue[]>>({});
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (!crawlId) {
          toast.error('ID de análisis no especificado');
          return;
        }
        
        console.log(`Loading crawl result for ID: ${crawlId}`);
        
        const result = await fetchCrawlResult(crawlId);
        setCrawlResult(result);
        
        // Fetch pages and ensure they have all required properties
        const pagesData = await getCrawlPages(crawlId);
        
        // Transform pages to ensure all required properties are present
        const completePages: CrawlPage[] = pagesData.map(page => ({
          ...page,
          content_type: page.content_type || 'text/html',
          issues_count: page.issues_count || 0,
          crawled_at: page.crawled_at || new Date().toISOString()
        }));
        
        setPages(completePages);
        
        const issuesByType: Record<string, CrawlIssue[]> = {};
        const issuesBySeverity: Record<string, CrawlIssue[]> = {};
        
        for (const page of completePages) {
          const issues = await fetchCrawlIssues(page.id);
          
          issues.forEach(issue => {
            if (!issuesByType[issue.issue_type]) {
              issuesByType[issue.issue_type] = [];
            }
            issuesByType[issue.issue_type].push({
              ...issue,
              page_url: page.url
            } as any);
            
            if (!issuesBySeverity[issue.severity]) {
              issuesBySeverity[issue.severity] = [];
            }
            issuesBySeverity[issue.severity].push({
              ...issue,
              page_url: page.url
            } as any);
          });
        }
        
        setIssuesByType(issuesByType);
        setIssuesBySeverity(issuesBySeverity);
      } catch (error) {
        console.error('Error loading crawl data:', error);
        toast.error('Error al cargar los datos del análisis SEO');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [crawlId]);
  
  const handlePageSelect = async (page: CrawlPage) => {
    try {
      setSelectedPage(page);
      const issues = await fetchCrawlIssues(page.id);
      setPageIssues(issues || []);
      
      const links = await fetchCrawlLinks(page.id);
      // Ensure links have the is_followed property
      const processedLinks = links.map(link => ({
        ...link,
        is_followed: 'follow' in link ? !!link.follow : link.is_followed
      }));
      
      setPageLinks(processedLinks);
    } catch (error) {
      console.error('Error loading page data:', error);
      toast.error('Error al cargar los datos de la página');
    }
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!crawlResult) {
    return <NotFoundState clientId={clientId} />;
  }
  
  return (
    <div className="space-y-6">
      <CrawlerHeader 
        clientId={clientId} 
        crawlResult={crawlResult} 
        onBack={onBack}
      />
      
      <CrawlerSummary 
        crawlResult={crawlResult} 
        issuesBySeverity={issuesBySeverity} 
      />
      
      <CrawlerTabs 
        pages={pages}
        selectedPage={selectedPage}
        pageIssues={pageIssues}
        pageLinks={pageLinks}
        issuesByType={issuesByType}
        onPageSelect={handlePageSelect}
      />
    </div>
  );
};

export default CrawlerDetailPage;
