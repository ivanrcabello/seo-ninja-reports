
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ScoreCard from './ScoreCard';
import MetricItem from './MetricItem';
import { formatScoreValue } from './utils';

interface DeviceScoreCardProps {
  title: string;
  icon: React.ReactNode;
  data: {
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
    firstContentfulPaint?: number;
    speedIndex?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    totalBlockingTime?: number;
    cumulativeLayoutShift?: number;
  };
  formatTimeMetric: (time: number | undefined, unit?: string) => string;
}

const DeviceScoreCard: React.FC<DeviceScoreCardProps> = ({ title, icon, data, formatTimeMetric }) => {
  // Ensure data exists
  if (!data) return null;
  
  console.log(`DeviceScoreCard ${title} data:`, data);
  
  // Format scores properly - these should already be between 0 and 1
  const performanceScore = data.performance;
  const accessibilityScore = data.accessibility;
  const bestPracticesScore = data.bestPractices;
  const seoScore = data.seo;
  
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm border-primary/10">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <ScoreCard 
            title="Rendimiento" 
            score={performanceScore} 
            description="Velocidad de carga" 
          />
          <ScoreCard 
            title="Accesibilidad" 
            score={accessibilityScore} 
            description="Facilidad de uso" 
          />
          <ScoreCard 
            title="Buenas Prácticas" 
            score={bestPracticesScore} 
            description="Código limpio" 
          />
          <ScoreCard 
            title="SEO" 
            score={seoScore} 
            description="Optimización" 
          />
        </div>
        
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Métricas Detalladas</h3>
        <div className="grid grid-cols-1 gap-2">
          <MetricItem 
            name="First Contentful Paint" 
            value={formatTimeMetric(data.firstContentfulPaint)} 
            description="Tiempo hasta que se muestra el primer contenido" 
          />
          <MetricItem 
            name="Speed Index" 
            value={formatTimeMetric(data.speedIndex)} 
            description="Rapidez con la que el contenido se muestra visualmente" 
          />
          <MetricItem 
            name="Largest Contentful Paint" 
            value={formatTimeMetric(data.largestContentfulPaint)} 
            description="Tiempo hasta que se muestra el contenido principal" 
          />
          <MetricItem 
            name="Time to Interactive" 
            value={formatTimeMetric(data.timeToInteractive)} 
            description="Tiempo hasta que la página es interactiva" 
          />
          <MetricItem 
            name="Total Blocking Time" 
            value={formatTimeMetric(data.totalBlockingTime, 'ms')} 
            description="Tiempo bloqueado del hilo principal" 
          />
          <MetricItem 
            name="Cumulative Layout Shift" 
            value={data.cumulativeLayoutShift !== undefined ? data.cumulativeLayoutShift.toFixed(2) : '—'} 
            description="Estabilidad visual durante la carga" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceScoreCard;
