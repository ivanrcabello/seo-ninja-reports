
import React from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle, LinkIcon, ExternalLink, FileText, XCircle } from 'lucide-react';
import { CrawlResult, CrawlPage, CrawlIssue } from '@/services/seo-crawler/types';
import BlurredCard from '@/components/ui/BlurredCard';
import { CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CrawlerSummaryProps {
  crawl: CrawlResult;
  pages: CrawlPage[];
  issuesByType: Record<string, CrawlIssue[]>;
  issuesBySeverity: Record<string, CrawlIssue[]>;
}

const CrawlerSummary: React.FC<CrawlerSummaryProps> = ({ 
  crawl, 
  pages, 
  issuesByType,
  issuesBySeverity
}) => {
  const { status, pages_crawled, total_pages, total_issues, total_links, total_internal_links, total_external_links, total_broken_links } = crawl;
  
  // Calculate percentages
  const crawlProgress = total_pages > 0 ? Math.round((pages_crawled / total_pages) * 100) : 0;
  const issuesPercent = pages.length > 0 ? Math.round((total_issues / pages.length) * 100) : 0;
  const brokenLinksPercent = total_links > 0 ? Math.round((total_broken_links / total_links) * 100) : 0;
  
  // Calculate totals by severity
  const criticalIssues = issuesBySeverity?.critical?.length || 0;
  const highIssues = issuesBySeverity?.high?.length || 0;
  const mediumIssues = issuesBySeverity?.medium?.length || 0;
  const lowIssues = issuesBySeverity?.low?.length || 0;

  // Format time
  const getTotalTime = (): string => {
    if (!crawl.total_time_seconds && crawl.total_time_seconds !== 0) return 'N/A';
    
    const seconds = Number(crawl.total_time_seconds);
    if (seconds < 60) return `${seconds} segundos`;
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes} min ${remainingSeconds} seg`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BlurredCard className="col-span-full md:col-span-2">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-primary">Resumen del análisis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Estado</span>
                <div className="flex items-center mt-1">
                  {status === 'completed' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Completado</span>
                    </>
                  ) : status === 'processing' ? (
                    <>
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium">Procesando...</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span className="font-medium">Fallido</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Progreso</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">{pages_crawled} / {total_pages} páginas</span>
                </div>
                <Progress value={crawlProgress} className="h-2 mt-2" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Tiempo total</span>
                <span className="font-medium mt-1">{getTotalTime()}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Problemas</span>
                <div className="flex items-center mt-1">
                  {total_issues > 0 ? (
                    <>
                      <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                      <span className="font-medium">{total_issues} problemas encontrados</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium">Sin problemas</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </BlurredCard>
      
      {/* Stats Card 1: Issues & Links */}
      <BlurredCard>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-primary">Problemas por gravedad</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span>Críticos</span>
              </div>
              <span className="font-medium">{criticalIssues}</span>
            </div>
            <Progress value={criticalIssues > 0 ? 100 : 0} className="h-2 bg-muted/50 text-red-500" indicatorClassName="bg-red-500" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                <span>Altos</span>
              </div>
              <span className="font-medium">{highIssues}</span>
            </div>
            <Progress value={highIssues > 0 ? Math.min(100, highIssues * 5) : 0} className="h-2 bg-muted/50" indicatorClassName="bg-amber-500" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <span>Medios</span>
              </div>
              <span className="font-medium">{mediumIssues}</span>
            </div>
            <Progress value={mediumIssues > 0 ? Math.min(100, mediumIssues * 2) : 0} className="h-2 bg-muted/50" indicatorClassName="bg-yellow-500" />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-blue-500 mr-2" />
                <span>Bajos</span>
              </div>
              <span className="font-medium">{lowIssues}</span>
            </div>
            <Progress value={lowIssues > 0 ? Math.min(100, lowIssues) : 0} className="h-2 bg-muted/50" indicatorClassName="bg-blue-500" />
          </div>
        </CardContent>
      </BlurredCard>
      
      {/* Stats Card 2: Content & Links */}
      <BlurredCard>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-primary">Enlaces</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-primary mr-2" />
                <span>Total de enlaces</span>
              </div>
              <span className="font-medium">{total_links}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Enlaces internos</span>
              </div>
              <span className="font-medium">{total_internal_links}</span>
            </div>
            <Progress 
              value={total_links > 0 ? (total_internal_links / total_links) * 100 : 0} 
              className="h-2 bg-muted/50" 
              indicatorClassName="bg-green-500" 
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 text-blue-500 mr-2" />
                <span>Enlaces externos</span>
              </div>
              <span className="font-medium">{total_external_links}</span>
            </div>
            <Progress 
              value={total_links > 0 ? (total_external_links / total_links) * 100 : 0} 
              className="h-2 bg-muted/50" 
              indicatorClassName="bg-blue-500" 
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span>Enlaces rotos</span>
              </div>
              <span className="font-medium">{total_broken_links}</span>
            </div>
            <Progress 
              value={total_links > 0 ? (total_broken_links / total_links) * 100 : 0} 
              className="h-2 bg-muted/50" 
              indicatorClassName="bg-red-500" 
            />
          </div>
        </CardContent>
      </BlurredCard>
    </div>
  );
};

export default CrawlerSummary;
