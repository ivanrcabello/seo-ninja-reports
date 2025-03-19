
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Gauge, LineChart } from 'lucide-react';
import ScoreCard from './ScoreCard';
import MetricItem from './MetricItem';

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
  return (
    <Card className="overflow-hidden border-primary/10 hover:shadow-md transition-all">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Main Scores */}
          <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <ScoreCard 
              label="Rendimiento" 
              score={data.performance} 
              icon={<Gauge className="h-4 w-4" />} 
            />
            <ScoreCard 
              label="Accesibilidad" 
              score={data.accessibility} 
              icon={<LineChart className="h-4 w-4" />} 
            />
            <ScoreCard 
              label="Prácticas" 
              score={data.bestPractices} 
              icon={<LineChart className="h-4 w-4" />} 
            />
            <ScoreCard 
              label="SEO" 
              score={data.seo} 
              icon={<LineChart className="h-4 w-4" />} 
            />
          </div>
          
          {/* Detailed Metrics */}
          <div className="col-span-2">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Métricas detalladas
            </h4>
            <div className="space-y-3">
              <MetricItem 
                label="First Contentful Paint" 
                value={formatTimeMetric(data.firstContentfulPaint, 's')} 
              />
              <MetricItem 
                label="Speed Index" 
                value={formatTimeMetric(data.speedIndex, 's')} 
              />
              <MetricItem 
                label="Largest Contentful Paint" 
                value={formatTimeMetric(data.largestContentfulPaint, 's')} 
              />
              <MetricItem 
                label="Time to Interactive" 
                value={formatTimeMetric(data.timeToInteractive, 's')} 
              />
              <MetricItem 
                label="Total Blocking Time" 
                value={formatTimeMetric(data.totalBlockingTime, 'ms')} 
              />
              <MetricItem 
                label="Cumulative Layout Shift" 
                value={data.cumulativeLayoutShift?.toFixed(2) || '—'} 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceScoreCard;
