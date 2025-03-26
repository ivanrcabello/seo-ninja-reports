
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink, CrawlHeading } from '@/services/seo-crawler/types';
import { getCrawlResult, getCrawlPages } from '@/services/seo-crawler/api';
import { getCrawlIssues, getPageHeadings, getCrawlHeadings, getPageLinks } from '@/services/seo-crawler/api/pageQueries';
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
        
        // Fetch issues separately
        const issuesData = await getCrawlIssues(crawlId);
        console.log('Issues data:', issuesData);
        
        // Fetch headings data
        const headingsData = await getCrawlHeadings(crawlId);
        console.log('Headings data:', headingsData);
        
        setPages(formattedPages);
        setIssues(issuesData);
        setAllHeadings(headingsData);
        
        // Group issues by type
        const groupedIssues: Record<string, CrawlIssue[]> = {};
        issuesData.forEach((issue: CrawlIssue) => {
          if (!groupedIssues[issue.issue_type]) {
            groupedIssues[issue.issue_type] = [];
          }
          groupedIssues[issue.issue_type].push(issue);
        });
        
        console.log('Grouped issues:', groupedIssues);
        setIssuesByType(groupedIssues);
        
        // Set the first page as selected if available
        if (formattedPages.length > 0) {
          setSelectedPage(formattedPages[0]);
          
          // Also fetch links for the first page since it's selected
          if (formattedPages[0].id) {
            const pageLinksData = await getPageLinks(formattedPages[0].id);
            setPageLinks(pageLinksData);
            
            // Set page issues for the first page
            const firstPageIssues = issuesData.filter((issue: CrawlIssue) => 
              issue.page_id === formattedPages[0].id
            );
            setPageIssues(firstPageIssues);
            
            // Set page headings for the first page
            const firstPageHeadings = headingsData.filter((heading: CrawlHeading) => 
              heading.page_id === formattedPages[0].id
            );
            
            // If no headings found through filter, try to fetch directly
            if (firstPageHeadings.length === 0) {
              try {
                const fetchedHeadings = await getPageHeadings(formattedPages[0].id);
                setPageHeadings(fetchedHeadings);
              } catch (err) {
                console.error('Error fetching first page headings:', err);
                setPageHeadings([]);
              }
            } else {
              setPageHeadings(firstPageHeadings);
            }
          }
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
  const handlePageSelect = async (page: CrawlPage) => {
    setSelectedPage(page);
    
    // Load page-specific issues and links
    try {
      setIsLoadingPageData(true);
      
      // Find issues for this page
      const filteredPageIssues = issues.filter(issue => issue.page_id === page.id);
      console.log(`Found ${filteredPageIssues.length} issues for page ${page.id}`, filteredPageIssues);
      setPageIssues(filteredPageIssues);
      
      // Fetch links for this page
      if (page.id) {
        const linksData = await getPageLinks(page.id);
        setPageLinks(linksData);
        
        // Try to find headings for this page from allHeadings first
        const filteredPageHeadings = allHeadings.filter(heading => heading.page_id === page.id);
        
        // If no headings found, try to fetch them
        if (filteredPageHeadings.length === 0) {
          try {
            const headingsData = await getPageHeadings(page.id);
            console.log(`Fetched ${headingsData.length} headings for page ${page.id}`, headingsData);
            setPageHeadings(headingsData);
          } catch (err) {
            console.error('Error fetching page headings:', err);
            setPageHeadings([]);
          }
        } else {
          console.log(`Found ${filteredPageHeadings.length} headings for page ${page.id} in allHeadings`, filteredPageHeadings);
          setPageHeadings(filteredPageHeadings);
        }
      }
      
    } catch (error) {
      console.error('Error loading page data:', error);
      toast.error('Error al cargar los datos de la página');
    } finally {
      setIsLoadingPageData(false);
    }
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
          onPageSelect={handlePageSelect}
          isLoadingPageData={isLoadingPageData}
        />
      )}
    </div>
  );
};

export default CrawlerDetailPage;
