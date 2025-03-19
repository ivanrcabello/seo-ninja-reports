
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Accessibility, 
  Cpu, 
  AlertCircle,
  Smartphone,
  Laptop
} from 'lucide-react';
import { formatNumber } from './utils';
import MetricItem from './MetricItem';

interface DeviceScoreCardProps {
  data: {
    performance?: number | null;
    accessibility?: number | null;
    bestPractices?: number | null;
    seo?: number | null;
    firstContentfulPaint?: number | null;
    speedIndex?: number | null;
    largestContentfulPaint?: number | null;
    timeToInteractive?: number | null;
    totalBlockingTime?: number | null;
    cumulativeLayoutShift?: number | null;
  };
  device: 'mobile' | 'desktop';
  title?: string;
  icon?: React.ReactNode;
}

const DeviceScoreCard: React.FC<DeviceScoreCardProps> = ({ data, device, title, icon }) => {
  console.log(`DeviceScoreCard ${device === 'desktop' ? 'Escritorio' : 'Móvil'} data:`, data);
  
  // Make sure data exists and has properties
  if (!data) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            {device === 'desktop' ? (
              <>
                <Laptop className="h-4 w-4 text-blue-500" />
                <span>Escritorio</span>
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 text-purple-500" />
                <span>Móvil</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
        </CardContent>
      </Card>
    );
  }

  // Safely calculate scores, defaulting to 0 if undefined/null
  const performanceScore = data.performance !== undefined && data.performance !== null 
    ? Math.round(data.performance * 100) 
    : 0;
  
  const accessibilityScore = data.accessibility !== undefined && data.accessibility !== null 
    ? Math.round(data.accessibility * 100) 
    : 0;
  
  const bestPracticesScore = data.bestPractices !== undefined && data.bestPractices !== null 
    ? Math.round(data.bestPractices * 100) 
    : 0;
  
  const seoScore = data.seo !== undefined && data.seo !== null 
    ? Math.round(data.seo * 100) 
    : 0;

  // Determine performance color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const displayTitle = title || (device === 'desktop' ? 'Escritorio' : 'Móvil');
  const displayIcon = icon || (device === 'desktop' ? 
    <Laptop className="h-4 w-4 text-blue-500" /> : 
    <Smartphone className="h-4 w-4 text-purple-500" />
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {displayIcon}
          <span>{displayTitle}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Performance Score */}
          <div className="flex flex-col items-center justify-center">
            <Activity className={`h-5 w-5 mb-1 ${getScoreColor(performanceScore)}`} />
            <span className={`text-xl font-bold ${getScoreColor(performanceScore)}`}>
              {performanceScore}
            </span>
            <span className="text-xs text-muted-foreground">Rendimiento</span>
          </div>
          
          {/* Accessibility Score */}
          <div className="flex flex-col items-center justify-center">
            <Accessibility className={`h-5 w-5 mb-1 ${getScoreColor(accessibilityScore)}`} />
            <span className={`text-xl font-bold ${getScoreColor(accessibilityScore)}`}>
              {accessibilityScore}
            </span>
            <span className="text-xs text-muted-foreground">Accesibilidad</span>
          </div>
          
          {/* Best Practices Score */}
          <div className="flex flex-col items-center justify-center">
            <Cpu className={`h-5 w-5 mb-1 ${getScoreColor(bestPracticesScore)}`} />
            <span className={`text-xl font-bold ${getScoreColor(bestPracticesScore)}`}>
              {bestPracticesScore}
            </span>
            <span className="text-xs text-muted-foreground">Buenas Prácticas</span>
          </div>
          
          {/* SEO Score */}
          <div className="flex flex-col items-center justify-center">
            <AlertCircle className={`h-5 w-5 mb-1 ${getScoreColor(seoScore)}`} />
            <span className={`text-xl font-bold ${getScoreColor(seoScore)}`}>
              {seoScore}
            </span>
            <span className="text-xs text-muted-foreground">SEO</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium mb-2">Métricas Principales</h3>
          <MetricItem 
            label="First Contentful Paint" 
            value={data.firstContentfulPaint} 
          />
          <MetricItem 
            label="Speed Index" 
            value={data.speedIndex} 
          />
          <MetricItem 
            label="Largest Contentful Paint" 
            value={data.largestContentfulPaint} 
          />
          <MetricItem 
            label="Time to Interactive" 
            value={data.timeToInteractive} 
          />
          <MetricItem 
            label="Total Blocking Time" 
            value={data.totalBlockingTime} 
          />
          <MetricItem 
            label="Cumulative Layout Shift" 
            value={data.cumulativeLayoutShift} 
            unit="" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceScoreCard;
