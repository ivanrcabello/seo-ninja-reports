
import React, { useState, useEffect } from 'react';
import { 
  getCrawlResult, 
  getCrawlPages, 
  getPageIssues,
  getPageLinks
} from '@/services/seo-crawler/api';
import { 
  CrawlResult, 
  CrawlPage, 
  CrawlIssue,
  CrawlLink
} from '@/services/seo-crawler/types';
import { toast } from 'sonner';

import CrawlerHeader from './CrawlerHeader';
import CrawlerSummary from './CrawlerSummary';
import CrawlerTabs from './CrawlerTabs';
import { Loader2 } from 'lucide-react';

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
        
        const result = await getCrawlResult(crawlId);
        setCrawlResult(result);
        
        // Fetch pages and ensure they have all required properties
        const pagesData = await getCrawlPages(crawlId);
        setPages(pagesData);
        
        const issuesByType: Record<string, CrawlIssue[]> = {};
        const issuesBySeverity: Record<string, CrawlIssue[]> = {};
        
        for (const page of pagesData) {
          const issues = await getPageIssues(page.id);
          
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
      const issues = await getPageIssues(page.id);
      setPageIssues(issues || []);
      
      const links = await getPageLinks(page.id);
      setPageLinks(links);
    } catch (error) {
      console.error('Error loading page data:', error);
      toast.error('Error al cargar los datos de la página');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!crawlResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Análisis no encontrado</h2>
        <p className="text-muted-foreground mb-6">No se ha podido encontrar el análisis solicitado</p>
        <button 
          className="text-primary hover:underline" 
          onClick={() => onBack && onBack()}
        >
          Volver a la lista de análisis
        </button>
      </div>
    );
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
