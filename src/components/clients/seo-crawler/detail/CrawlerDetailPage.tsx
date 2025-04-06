
import React, { useEffect, useState } from 'react';
import { CrawlResult, CrawlPage, CrawlIssue, CrawlLink, CrawlHeading } from '@/services/seo-crawler/types';
import { getCrawlResult, getCrawlPages } from '@/services/seo-crawler/api';
import { getPageIssues, getCrawlIssues, getPageHeadings, getCrawlHeadings, getPageLinks, getCrawlLinks } from '@/services/seo-crawler/api/pageQueries';
import CrawlerDetailHeader from './CrawlerDetailHeader';
import CrawlerTabs from './CrawlerTabs';
import CrawlerReportView from '@/components/reports/report-viewer/CrawlerReportView';
import CrawlerErrorDisplay from './CrawlerErrorDisplay';
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
  
  const [issuesByType, setIssuesByType] = useState<Record<string, CrawlIssue[]>>({});
  const [issuesBySeverity, setIssuesBySeverity] = useState<Record<string, CrawlIssue[]>>({});
  
  // Function to load all data
  const loadData = async () => {
    if (!crawlId) {
      setIsLoading(false);
      toast.error('ID de análisis no válido');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const result = await getCrawlResult(crawlId);
      console.log('Crawl result:', result);
      setCrawl(result);
      
      const pagesData = await getCrawlPages(crawlId);
      console.log('Pages data:', pagesData);
      
      const formattedPages = pagesData.map((page: any) => ({
        ...page,
        issues_count: Number(page.issues_count || 0),
        is_internal: page.is_internal !== undefined ? page.is_internal : true,
        is_crawled: page.is_crawled !== undefined ? page.is_crawled : true,
        created_at: page.created_at || page.crawled_at || new Date().toISOString(),
        updated_at: page.updated_at || page.crawled_at || new Date().toISOString()
      })) as CrawlPage[];
      
      let issuesData: CrawlIssue[] = [];
      try {
        const rawIssuesData = await getCrawlIssues(crawlId);
        console.log('Issues data:', rawIssuesData);
        
        // Add required fields for CrawlIssue type
        issuesData = rawIssuesData.map((issue: any) => ({
          ...issue,
          type: issue.issue_type, // Ensure type is set as an alias to issue_type
          created_at: issue.created_at || new Date().toISOString()
        })) as CrawlIssue[];
        
        const tempIssuesByType: Record<string, CrawlIssue[]> = {};
        const tempIssuesBySeverity: Record<string, CrawlIssue[]> = {};
        
        issuesData.forEach((issue: CrawlIssue) => {
          if (!issue.issue_type) return;
          
          if (!tempIssuesByType[issue.issue_type]) {
            tempIssuesByType[issue.issue_type] = [];
          }
          tempIssuesByType[issue.issue_type].push(issue);
          
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
      
      let headingsData: CrawlHeading[] = [];
      try {
        headingsData = await getCrawlHeadings(crawlId) as CrawlHeading[];
        console.log('Headings data:', headingsData);
      } catch (err) {
        console.error('Failed to fetch headings:', err);
        headingsData = [];
      }
      
      setPages(formattedPages);
      setIssues(issuesData);
      setAllHeadings(headingsData);
      
      if (formattedPages.length > 0) {
        setSelectedPage(formattedPages[0]);
        
        await loadPageData(formattedPages[0], issuesData, headingsData);
      }
    } catch (error) {
      console.error('Error fetching crawl data:', error);
      toast.error('Error al cargar los datos del análisis');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [crawlId]);
  
  const loadPageData = async (page: CrawlPage, allIssues: CrawlIssue[] = [], allHeadings: CrawlHeading[] = []) => {
    if (!page.id) return;
    
    try {
      setIsLoadingPageData(true);
      
      const pageIssuesFromAll = allIssues.filter(issue => 
        issue.page_id === page.id || 
        (issue.page_url && issue.page_url === page.url)
      );
      
      let pageIssuesData = pageIssuesFromAll;
      
      if (pageIssuesFromAll.length === 0 && page.issues_count && page.issues_count > 0) {
        console.log(`No issues found in preloaded data for page ${page.id}, but issues_count is ${page.issues_count}. Fetching directly...`);
        try {
          const fetchedIssues = await getPageIssues(page.id);
          // Add required fields
          pageIssuesData = fetchedIssues.map((issue: any) => ({
            ...issue,
            type: issue.issue_type,
            created_at: issue.created_at || new Date().toISOString()
          })) as CrawlIssue[];
          console.log(`Fetched ${fetchedIssues.length} issues for page ${page.id}`);
        } catch (err) {
          console.error('Error fetching page issues directly:', err);
        }
      }
      
      console.log(`Setting ${pageIssuesData.length} issues for page ${page.id}`);
      setPageIssues(pageIssuesData);
      
      try {
        const rawLinksData = await getPageLinks(page.id);
        // Add required fields for CrawlLink type
        const linksData = rawLinksData.map((link: any) => ({
          ...link,
          is_followed: link.follow !== undefined ? link.follow : true,
          created_at: link.created_at || new Date().toISOString()
        })) as CrawlLink[];
        setPageLinks(linksData);
      } catch (err) {
        console.error('Error fetching page links:', err);
        setPageLinks([]);
      }
      
      const filteredPageHeadings = allHeadings.filter(heading => heading.page_id === page.id);
      console.log(`Found ${filteredPageHeadings.length} headings for page ${page.id} from preloaded data`);
      
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
      
      {/* Show error display if there's an error and status is failed */}
      {crawl.error_message && crawl.status === 'failed' && (
        <CrawlerErrorDisplay crawl={crawl} onRefresh={loadData} />
      )}
      
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
