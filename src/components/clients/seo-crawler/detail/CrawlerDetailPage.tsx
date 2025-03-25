
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
  const [isLoadingPageData, setIsLoadingPageData] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (!crawlId) {
          toast.error('ID de análisis no especificado');
          return;
        }
        
        console.log(`Loading crawl result for ID: ${crawlId}`);
        
        // Cargar datos básicos del análisis y páginas
        const [result, pagesData] = await Promise.all([
          getCrawlResult(crawlId),
          getCrawlPages(crawlId)
        ]);
        
        if (!result) {
          console.error('No se pudo obtener el resultado del análisis');
          return;
        }
        
        setCrawlResult(result);
        setPages(pagesData || []);
        
        // Si hay páginas, preseleccionar la primera
        if (pagesData && pagesData.length > 0) {
          setSelectedPage(pagesData[0]);
          // Cargar datos detallados de la primera página
          handlePageSelect(pagesData[0]);
        }
        
        // Carga inicial de la distribución de problemas por tipo y severidad
        // Esta carga se hace de forma separada para no bloquear la interfaz
        loadIssuesDistribution();
        
      } catch (error) {
        console.error('Error loading crawl data:', error);
        toast.error('Error al cargar los datos del análisis SEO');
      } finally {
        setIsLoading(false);
      }
    };
    
    const loadIssuesDistribution = async () => {
      try {
        if (!crawlId) return;
        
        // Aquí podríamos optimizar usando endpoints específicos para obtener
        // solo la distribución de issues, pero por ahora cargamos todos los issues
        // y los procesamos en el cliente
        const issuesByType: Record<string, CrawlIssue[]> = {};
        const issuesBySeverity: Record<string, CrawlIssue[]> = {};
        
        for (const page of pages) {
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
        console.error('Error loading issues distribution:', error);
      }
    };
    
    loadData();
  }, [crawlId]);
  
  const handlePageSelect = async (page: CrawlPage) => {
    try {
      setSelectedPage(page);
      setIsLoadingPageData(true);
      
      // Cargar datos detallados de la página seleccionada en paralelo
      const [issues, links] = await Promise.all([
        getPageIssues(page.id),
        getPageLinks(page.id)
      ]);
      
      setPageIssues(issues || []);
      setPageLinks(links || []);
    } catch (error) {
      console.error('Error loading page data:', error);
      toast.error('Error al cargar los datos de la página');
    } finally {
      setIsLoadingPageData(false);
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
        isLoadingPageData={isLoadingPageData}
      />
    </div>
  );
};

export default CrawlerDetailPage;
