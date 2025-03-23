
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchCrawlResult, 
  fetchCrawlPages, 
  fetchCrawlIssues, 
  CrawlResult, 
  CrawlPage, 
  CrawlIssue 
} from '@/services/seo-crawler';
import { toast } from 'sonner';

import CrawlerHeader from './CrawlerHeader';
import CrawlerSummary from './CrawlerSummary';
import CrawlerTabs from './CrawlerTabs';
import LoadingState from './LoadingState';
import NotFoundState from './NotFoundState';

const CrawlerDetailPage: React.FC = () => {
  const { clientId, crawlId } = useParams<{ clientId: string; crawlId: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [pages, setPages] = useState<CrawlPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CrawlPage | null>(null);
  const [pageIssues, setPageIssues] = useState<CrawlIssue[]>([]);
  const [issuesByType, setIssuesByType] = useState<Record<string, CrawlIssue[]>>({});
  const [issuesBySeverity, setIssuesBySeverity] = useState<Record<string, CrawlIssue[]>>({});
  
  // Cargar datos del análisis
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (!crawlId) {
          toast.error('ID de análisis no especificado');
          navigate(`/clients/${clientId}`);
          return;
        }
        
        // Obtener resultado principal
        const result = await fetchCrawlResult(crawlId);
        setCrawlResult(result);
        
        // Obtener páginas analizadas
        const pagesData = await fetchCrawlPages(crawlId);
        setPages(pagesData || []);
        
        // Obtener todos los problemas por tipo y severidad
        const issuesByType: Record<string, CrawlIssue[]> = {};
        const issuesBySeverity: Record<string, CrawlIssue[]> = {};
        
        // Para cada página, obtener sus problemas
        for (const page of pagesData) {
          const issues = await fetchCrawlIssues(page.id);
          
          // Agrupar por tipo
          issues.forEach(issue => {
            if (!issuesByType[issue.issue_type]) {
              issuesByType[issue.issue_type] = [];
            }
            issuesByType[issue.issue_type].push({
              ...issue,
              page_url: page.url // Añadir URL de la página para referencia
            } as any);
            
            // Agrupar por severidad
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
        toast.error('Error al cargar los datos del análisis SEO');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [crawlId, clientId, navigate]);
  
  // Cargar problemas de una página específica
  const handlePageSelect = async (page: CrawlPage) => {
    try {
      setSelectedPage(page);
      const issues = await fetchCrawlIssues(page.id);
      setPageIssues(issues || []);
    } catch (error) {
      toast.error('Error al cargar los problemas de la página');
    }
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!crawlResult) {
    return <NotFoundState clientId={clientId || ''} />;
  }
  
  return (
    <div className="space-y-6">
      <CrawlerHeader 
        clientId={clientId || ''} 
        crawlResult={crawlResult} 
      />
      
      <CrawlerSummary 
        crawlResult={crawlResult} 
        issuesBySeverity={issuesBySeverity} 
      />
      
      <CrawlerTabs 
        pages={pages}
        selectedPage={selectedPage}
        pageIssues={pageIssues}
        issuesByType={issuesByType}
        onPageSelect={handlePageSelect}
      />
    </div>
  );
};

export default CrawlerDetailPage;
