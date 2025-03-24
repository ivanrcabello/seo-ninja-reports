
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CrawlResult } from '@/services/seo-crawler/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CrawlerSummaryProps {
  crawlResult: CrawlResult;
  issuesBySeverity: Record<string, any[]>;
}

const CrawlerSummary: React.FC<CrawlerSummaryProps> = ({ 
  crawlResult,
  issuesBySeverity
}) => {
  // Contar problemas por severidad
  const highIssues = issuesBySeverity.high?.length || 0;
  const mediumIssues = issuesBySeverity.medium?.length || 0;
  const lowIssues = issuesBySeverity.low?.length || 0;

  // Use appropriate date field
  const dateFormatted = format(
    new Date(crawlResult.crawl_date || crawlResult.started_at || crawlResult.inserted_at), 
    'PPP, HH:mm', 
    { locale: es }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del Análisis</CardTitle>
        <CardDescription>
          Análisis realizado el {dateFormatted}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Páginas analizadas</h3>
                <p className="text-3xl font-bold">{crawlResult.pages_crawled}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Problemas detectados</h3>
                <p className="text-3xl font-bold">{crawlResult.issues_count || crawlResult.total_issues}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-red-500">{highIssues} altos</span>
                  <span>·</span>
                  <span className="text-orange-500">{mediumIssues} medios</span>
                  <span>·</span>
                  <span className="text-blue-500">{lowIssues} bajos</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Tiempo de análisis</h3>
                <p className="text-3xl font-bold">
                  {crawlResult.total_time_seconds 
                    ? `${Math.round(crawlResult.total_time_seconds / 60)} min` 
                    : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrawlerSummary;
