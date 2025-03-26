
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink, CrawlHeading } from '@/services/seo-crawler/types';
import { getCrawlResult, getCrawlPages } from '@/services/seo-crawler/api';
import { getCrawlIssues, getPageIssues, getPageHeadings, getCrawlHeadings, getPageLinks } from '@/services/seo-crawler/api/pageQueries';
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
  const [pageHeadings, setPageHeadings] = useState<CrawlHeading[]>([]);
  const [allHeadings, setAllHeadings] = useState<CrawlHeading[]>([]);
  const [selectedPage, setSelectedPage] = useState<CrawlPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPageData, setIsLoadingPageData] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReport, setShowReport] = useState(false);
  
  // Group issues by type for reporting
  const [issuesByType, setIssuesByType] = useState<Record<string, CrawlIssue[]>>({});
  const [issuesBySeverity, setIssuesBySeverity] = useState<Record<string, CrawlIssue[]>>({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch crawl result
        const result = await getCrawlResult(crawlId);
        console.log('Crawl result:', result);
        setCrawl(result);
        
        // Fetch pages
        const pagesData = await getCrawlPages(crawlId);
        console.log('Pages data:', pagesData);
        
        // Ensure page issues_count are correctly formatted
        const formattedPages = pagesData.map((page: CrawlPage) => ({
          ...page,
          issues_count: Number(page.issues_count || 0)
        }));
        
        // Fetch issues separately - this is causing problems
        let issuesData: CrawlIssue[] = [];
        try {
          issuesData = await getCrawlIssues(crawlId);
          console.log('Issues data:', issuesData);
          
          // Initialize with empty arrays to avoid undefined errors
          const tempIssuesByType: Record<string, CrawlIssue[]> = {};
          const tempIssuesBySeverity: Record<string, CrawlIssue[]> = {};
          
          // Group issues by type and severity
          issuesData.forEach((issue: CrawlIssue) => {
            if (!issue.issue_type || !issue.severity) return;
            
            // Group by type
            if (!tempIssuesByType[issue.issue_type]) {
              tempIssuesByType[issue.issue_type] = [];
            }
            tempIssuesByType[issue.issue_type].push(issue);
            
            // Group by severity
            if (!tempIssuesBySeverity[issue.severity]) {
              tempIssuesBySeverity[issue.severity] = [];
            }
            tempIssuesBySeverity[issue.severity].push(issue);
          });
          
          setIssuesByType(tempIssuesByType);
          setIssuesBySeverity(tempIssuesBySeverity);
        } catch (err) {
          console.error('Failed to fetch issues:', err);
          toast.error('Error al cargar los problemas de SEO');
        }
        
        // Fetch headings data - this is causing problems too
        let headingsData: CrawlHeading[] = [];
        try {
          headingsData = await getCrawlHeadings(crawlId);
          console.log('Headings data:', headingsData);
        } catch (err) {
          console.error('Failed to fetch headings:', err);
          headingsData = []; // Reset to empty array to avoid undefined errors
        }
        
        setPages(formattedPages);
        setIssues(issuesData);
        setAllHeadings(headingsData);
        
        // Set the first page as selected if available
        if (formattedPages.length > 0) {
          setSelectedPage(formattedPages[0]);
          
          // Also fetch data for the first page since it's selected
          await loadPageData(formattedPages[0], issuesData, headingsData);
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
  
  // Load data for a specific page
  const loadPageData = async (page: CrawlPage, allIssues: CrawlIssue[] = [], allHeadings: CrawlHeading[] = []) => {
    if (!page.id) return;
    
    try {
      setIsLoadingPageData(true);
      
      // Find issues for this page from already loaded issues if possible
      const filteredPageIssues = allIssues.filter(issue => issue.page_id === page.id);
      console.log(`Found ${filteredPageIssues.length} issues for page ${page.id} from preloaded data`);
      
      // If no issues found, try to fetch directly
      let pageIssuesData = filteredPageIssues;
      if (filteredPageIssues.length === 0) {
        try {
          const fetchedIssues = await getPageIssues(page.id);
          pageIssuesData = fetchedIssues;
          console.log(`Fetched ${fetchedIssues.length} issues for page ${page.id}`);
        } catch (err) {
          console.error('Error fetching page issues directly:', err);
        }
      }
      
      setPageIssues(pageIssuesData);
      
      // Fetch links for this page
      try {
        const linksData = await getPageLinks(page.id);
        setPageLinks(linksData);
      } catch (err) {
        console.error('Error fetching page links:', err);
        setPageLinks([]);
      }
      
      // Try to find headings for this page from allHeadings first
      const filteredPageHeadings = allHeadings.filter(heading => heading.page_id === page.id);
      console.log(`Found ${filteredPageHeadings.length} headings for page ${page.id} from preloaded data`);
      
      // If no headings found, try to fetch them directly
      if (filteredPageHeadings.length === 0) {
        try {
          const headingsData = await getPageHeadings(page.id);
          console.log(`Fetched ${headingsData.length} headings for page ${page.id}`);
          setPageHeadings(headingsData);
        } catch (err) {
          console.error('Error fetching page headings directly:', err);
          setPageHeadings([]);
        }
      } else {
        setPageHeadings(filteredPageHeadings);
      }
    } catch (error) {
      console.error('Error loading page data:', error);
      toast.error('Error al cargar los datos de la página');
    } finally {
      setIsLoadingPageData(false);
    }
  };
  
  // Handle page selection
  const handlePageSelect = async (page: CrawlPage) => {
    setSelectedPage(page);
    await loadPageData(page, issues, allHeadings);
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
        <CrawlerReportView 
          crawlResult={crawl} 
          pages={pages}
          issues={issues}
          headings={allHeadings}
        />
      ) : (
        <CrawlerTabs 
          pages={pages}
          selectedPage={selectedPage}
          pageIssues={pageIssues}
          pageLinks={pageLinks}
          pageHeadings={pageHeadings}
          issuesByType={issuesByType}
          issuesBySeverity={issuesBySeverity}
          onPageSelect={handlePageSelect}
          isLoadingPageData={isLoadingPageData}
        />
      )}
    </div>
  );
};

export default CrawlerDetailPage;
