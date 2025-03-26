
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrawlPage, CrawlResult, CrawlIssue, CrawlLink } from '@/services/seo-crawler/types';
import { getCrawlData } from '@/services/seo-crawler/crawlerService';
import { toast } from '@/components/ui/use-toast';
import CrawlerTabs from './CrawlerTabs';
import CrawlerHeader from './CrawlerHeader';
import CrawlerSummary from './CrawlerSummary';
import LoadingState from './LoadingState';
import NotFoundState from './NotFoundState';

interface CrawlerDetailPageProps {
  clientId: string;
  crawlId: string;
  onBack: () => void;
}

const CrawlerDetailPage: React.FC<CrawlerDetailPageProps> = ({ 
  clientId,
  crawlId,
  onBack
}) => {
  const [crawl, setCrawl] = useState<CrawlResult | null>(null);
  const [pages, setPages] = useState<CrawlPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CrawlPage | null>(null);
  const [pageIssues, setPageIssues] = useState<CrawlIssue[]>([]);
  const [pageLinks, setPageLinks] = useState<CrawlLink[]>([]);
  const [issuesByType, setIssuesByType] = useState<Record<string, CrawlIssue[]>>({});
  const [issuesBySeverity, setIssuesBySeverity] = useState<Record<string, CrawlIssue[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPageData, setIsLoadingPageData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Function to refresh the crawler status
  const refreshCrawlStatus = async () => {
    try {
      const data = await getCrawlData(crawlId);
      setCrawl(data.result);
      
      // If the status is still processing, check again in 10 seconds
      if (data.result.status === 'processing') {
        setTimeout(refreshCrawlStatus, 10000);
      }
    } catch (error) {
      console.error('Error refreshing crawl status:', error);
    }
  };

  useEffect(() => {
    const fetchCrawlData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getCrawlData(crawlId);
        
        setCrawl(data.result);
        setPages(data.pages);
        setIssuesByType(data.issuesByType);
        setIssuesBySeverity(data.issuesBySeverity);
        
        // If status is processing, set up a polling mechanism
        if (data.result.status === 'processing') {
          setTimeout(refreshCrawlStatus, 10000);
        }
        
        // Si hay páginas, selecciona la primera por defecto
        if (data.pages.length > 0) {
          setSelectedPage(data.pages[0]);
          // Obtén los issues y links de la primera página
          const pageId = data.pages[0].id;
          setPageIssues(data.issues[pageId] || []);
          setPageLinks(data.links[pageId] || []);
        }
      } catch (error) {
        console.error('Error fetching crawl data:', error);
        setError('No se pudieron cargar los datos del análisis');
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos del análisis"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrawlData();
  }, [crawlId]);

  const handlePageSelect = (page: CrawlPage) => {
    setIsLoadingPageData(true);
    setSelectedPage(page);
    
    // Busca en los datos ya cargados
    const pageId = page.id;
    
    // Usa setTimeout para simular una carga asíncrona y evitar bloqueos de UI
    setTimeout(() => {
      try {
        // Intentar obtener issues y links de los datos ya cargados
        const issues = issuesByType ? 
          Object.values(issuesByType).flat().filter(issue => issue.page_id === pageId) :
          [];
          
        setPageIssues(issues);
        
        // Intentar obtener links de la página seleccionada
        const fetchPageLinks = async () => {
          try {
            const { getPageLinks } = await import('@/services/seo-crawler/api/pageQueries');
            const links = await getPageLinks(pageId);
            setPageLinks(links);
          } catch (error) {
            console.error('Error loading page links:', error);
            setPageLinks([]);
          } finally {
            setIsLoadingPageData(false);
          }
        };
        
        fetchPageLinks();
      } catch (error) {
        console.error('Error selecting page:', error);
        setPageIssues([]);
        setPageLinks([]);
        setIsLoadingPageData(false);
      }
    }, 100);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !crawl) {
    return <NotFoundState clientId={clientId} error={error} onBack={onBack} />;
  }

  return (
    <div className="space-y-8">
      <CrawlerHeader
        clientId={clientId}
        crawlResult={crawl}
        onBack={onBack}
      />
      
      <CrawlerSummary crawl={crawl} pages={pages} issuesByType={issuesByType} issuesBySeverity={issuesBySeverity} />
      
      <CrawlerTabs
        pages={pages}
        selectedPage={selectedPage}
        pageIssues={pageIssues}
        pageLinks={pageLinks}
        issuesByType={issuesByType}
        onPageSelect={handlePageSelect}
        isLoadingPageData={isLoadingPageData}
      />
    </div>
  );
};

export default CrawlerDetailPage;
