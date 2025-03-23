
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CrawlResult } from '@/services/seo-crawler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlurredCard from '@/components/ui/BlurredCard';

interface CrawlerSummaryProps {
  crawlResult: CrawlResult;
  issuesBySeverity: Record<string, any[]>;
}

const CrawlerSummary: React.FC<CrawlerSummaryProps> = ({ 
  crawlResult,
  issuesBySeverity
}) => {
  return (
    <BlurredCard>
      <CardHeader>
        <CardTitle>Resumen del Análisis</CardTitle>
        <CardDescription>
          Análisis realizado el {format(new Date(crawlResult.crawl_date), 'PPP, HH:mm', { locale: es })}
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
                <h3 className="text-lg font-semibold mb-2">Problemas encontrados</h3>
                <p className="text-3xl font-bold text-orange-500">{crawlResult.issues_count}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2">Tiempo de análisis</h3>
                <p className="text-3xl font-bold">{crawlResult.total_time_seconds}s</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Problemas por severidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SeverityCard 
              title="Alta gravedad" 
              description="Requieren atención inmediata"
              count={issuesBySeverity['high']?.length || 0}
              colorClass="border-l-red-500"
              textColorClass="text-red-500"
            />
            
            <SeverityCard 
              title="Gravedad media" 
              description="Atender cuando sea posible"
              count={issuesBySeverity['medium']?.length || 0}
              colorClass="border-l-orange-500"
              textColorClass="text-orange-500"
            />
            
            <SeverityCard 
              title="Gravedad baja" 
              description="Mejoras recomendadas"
              count={issuesBySeverity['low']?.length || 0}
              colorClass="border-l-yellow-500"
              textColorClass="text-yellow-500"
            />
          </div>
        </div>
      </CardContent>
    </BlurredCard>
  );
};

interface SeverityCardProps {
  title: string;
  description: string;
  count: number;
  colorClass: string;
  textColorClass: string;
}

const SeverityCard: React.FC<SeverityCardProps> = ({
  title,
  description,
  count,
  colorClass,
  textColorClass
}) => {
  return (
    <Card className={`border-l-4 ${colorClass} ${count === 0 ? 'opacity-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <p className={`text-2xl font-bold ${textColorClass}`}>
            {count}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrawlerSummary;
