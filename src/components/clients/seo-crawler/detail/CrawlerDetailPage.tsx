
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CrawlResult, CrawlPage } from '@/services/seo-crawler/types';
import { fetchCrawlResult, fetchCrawlPages, fetchCrawlIssues } from '@/services/seo-crawler';
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
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReport, setShowReport] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch crawl result
        const result = await fetchCrawlResult(crawlId);
        setCrawl(result);
        
        // Fetch pages and issues
        const pagesData = await fetchCrawlPages(crawlId);
        const issuesData = await fetchCrawlIssues(crawlId);
        
        setPages(pagesData);
        setIssues(issuesData);
      } catch (error) {
        console.error('Error fetching crawl data:', error);
        toast.error('Error al cargar los datos del análisis');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [crawlId]);

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
          crawl={crawl}
          pages={pages}
          issues={issues}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          clientId={clientId}
        />
      )}
    </div>
  );
};

export default CrawlerDetailPage;
