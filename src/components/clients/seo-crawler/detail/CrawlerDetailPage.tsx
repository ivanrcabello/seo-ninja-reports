
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink } from '@/services/seo-crawler/types';
import { getCrawlResult, getCrawlPages, getCrawlIssues } from '@/services/seo-crawler/api';
import CrawlerDetailHeader from './CrawlerDetailHeader';
import CrawlerTabs from './CrawlerTabs';
import CrawlerReportView from '@/components/reports/report-viewer/CrawlerReportView';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
  const [crawl, setCrawl] = useState<CrawlResult | null>(null);
  const [pages, setPages] = useState<CrawlPage[]>([]);
  const [issues, setIssues] = useState<CrawlIssue[]>([]);
  const [pageIssues, setPageIssues] = useState<CrawlIssue[]>([]);
  const [pageLinks, setPageLinks] = useState<CrawlLink[]>([]);
  const [selectedPage, setSelectedPage] = useState<CrawlPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPageData, setIsLoadingPageData] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReport, setShowReport] = useState(false);
  
  // Group issues by type for reporting
  const [issuesByType, setIssuesByType] = useState<Record<string, CrawlIssue[]>>({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch crawl result
        const result = await getCrawlResult(crawlId);
        setCrawl(result);
        
        // Fetch pages and issues
        const pagesData = await getCrawlPages(crawlId);
        const issuesData = await getCrawlIssues(crawlId);
        
        setPages(pagesData);
        setIssues(issuesData);
        
        // Group issues by type
        const groupedIssues: Record<string, CrawlIssue[]> = {};
        issuesData.forEach((issue: CrawlIssue) => {
          if (!groupedIssues[issue.issue_type]) {
            groupedIssues[issue.issue_type] = [];
          }
          groupedIssues[issue.issue_type].push(issue);
        });
        setIssuesByType(groupedIssues);
        
        // Set the first page as selected if available
        if (pagesData.length > 0) {
          setSelectedPage(pagesData[0]);
        }
      } catch (error) {
        console.error('Error fetching crawl data:', error);
        toast.error('Error al cargar los datos del análisis');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [crawlId]);
  
  // Handle page selection
  const handlePageSelect = (page: CrawlPage) => {
    setSelectedPage(page);
    
    // Load page-specific issues and links
    const loadPageData = async () => {
      try {
        setIsLoadingPageData(true);
        
        // Find issues for this page
        const pageIssues = issues.filter(issue => issue.page_id === page.id);
        setPageIssues(pageIssues);
        
        // Here you'd load links for the page too
        // For now we'll set empty array
        setPageLinks([]);
        
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        setIsLoadingPageData(false);
      }
    };
    
    loadPageData();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="text-muted-foreground">Cargando datos del análisis...</p>
      </div>
    );
  }

  if (!crawl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">No se ha encontrado el análisis</p>
        <button 
          className="text-primary hover:underline" 
          onClick={onBack}
        >
          Volver a la lista de análisis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CrawlerDetailHeader 
        crawl={crawl} 
        onBack={onBack}
        showReport={() => setShowReport(!showReport)} 
        isReportShown={showReport}
      />
      
      {showReport ? (
        <CrawlerReportView crawlResult={crawl} />
      ) : (
        <CrawlerTabs 
          pages={pages}
          selectedPage={selectedPage}
          pageIssues={pageIssues}
          pageLinks={pageLinks}
          issuesByType={issuesByType}
          onPageSelect={handlePageSelect}
          isLoadingPageData={isLoadingPageData}
        />
      )}
    </div>
  );
};

export default CrawlerDetailPage;
