
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gauge, Smartphone, Monitor, Clock, ZapOff, LineChart } from 'lucide-react';

interface PageSpeedDataProps {
  data: {
    desktop: {
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
    mobile: {
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
  };
}

const PageSpeedTab: React.FC<PageSpeedDataProps> = ({ data }) => {
  const getScoreColor = (score: number | undefined) => {
    if (!score) return 'bg-gray-200 text-gray-700';
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreIndicator = (score: number | undefined) => {
    if (!score) return '—';
    return `${Math.round(score)}%`;
  };

  const formatTimeMetric = (time: number | undefined, unit: string = 's') => {
    if (!time) return '—';
    if (unit === 's' && time > 1000) {
      return `${(time / 1000).toFixed(2)}s`;
    }
    return `${time}${unit}`;
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Gauge className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Rendimiento de la página</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desktop Score Card */}
        <Card className="overflow-hidden border-primary/10 hover:shadow-md transition-all">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 flex items-center gap-3">
            <Monitor className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Escritorio</h3>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Main Scores */}
              <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <ScoreCard 
                  label="Rendimiento" 
                  score={data.desktop.performance} 
                  icon={<Gauge className="h-4 w-4" />} 
                />
                <ScoreCard 
                  label="Accesibilidad" 
                  score={data.desktop.accessibility} 
                  icon={<LineChart className="h-4 w-4" />} 
                />
                <ScoreCard 
                  label="Prácticas" 
                  score={data.desktop.bestPractices} 
                  icon={<LineChart className="h-4 w-4" />} 
                />
                <ScoreCard 
                  label="SEO" 
                  score={data.desktop.seo} 
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
                    value={formatTimeMetric(data.desktop.firstContentfulPaint, 's')} 
                  />
                  <MetricItem 
                    label="Speed Index" 
                    value={formatTimeMetric(data.desktop.speedIndex, 's')} 
                  />
                  <MetricItem 
                    label="Largest Contentful Paint" 
                    value={formatTimeMetric(data.desktop.largestContentfulPaint, 's')} 
                  />
                  <MetricItem 
                    label="Time to Interactive" 
                    value={formatTimeMetric(data.desktop.timeToInteractive, 's')} 
                  />
                  <MetricItem 
                    label="Total Blocking Time" 
                    value={formatTimeMetric(data.desktop.totalBlockingTime, 'ms')} 
                  />
                  <MetricItem 
                    label="Cumulative Layout Shift" 
                    value={data.desktop.cumulativeLayoutShift?.toFixed(2) || '—'} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Score Card */}
        <Card className="overflow-hidden border-primary/10 hover:shadow-md transition-all">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Móvil</h3>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Main Scores */}
              <div className="col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <ScoreCard 
                  label="Rendimiento" 
                  score={data.mobile.performance} 
                  icon={<Gauge className="h-4 w-4" />} 
                />
                <ScoreCard 
                  label="Accesibilidad" 
                  score={data.mobile.accessibility} 
                  icon={<LineChart className="h-4 w-4" />} 
                />
                <ScoreCard 
                  label="Prácticas" 
                  score={data.mobile.bestPractices} 
                  icon={<LineChart className="h-4 w-4" />} 
                />
                <ScoreCard 
                  label="SEO" 
                  score={data.mobile.seo} 
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
                    value={formatTimeMetric(data.mobile.firstContentfulPaint, 's')} 
                  />
                  <MetricItem 
                    label="Speed Index" 
                    value={formatTimeMetric(data.mobile.speedIndex, 's')} 
                  />
                  <MetricItem 
                    label="Largest Contentful Paint" 
                    value={formatTimeMetric(data.mobile.largestContentfulPaint, 's')} 
                  />
                  <MetricItem 
                    label="Time to Interactive" 
                    value={formatTimeMetric(data.mobile.timeToInteractive, 's')} 
                  />
                  <MetricItem 
                    label="Total Blocking Time" 
                    value={formatTimeMetric(data.mobile.totalBlockingTime, 'ms')} 
                  />
                  <MetricItem 
                    label="Cumulative Layout Shift" 
                    value={data.mobile.cumulativeLayoutShift?.toFixed(2) || '—'} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-sm text-muted-foreground mt-4 p-4 bg-primary/5 rounded-lg">
        <div className="flex items-start gap-2">
          <ZapOff className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>Estos datos son proporcionados por Google PageSpeed Insights. Las puntuaciones altas indican mejor rendimiento de la página, y 90 o más se considera bueno.</p>
        </div>
      </div>
    </section>
  );
};

// Helper component for score cards
const ScoreCard = ({ label, score, icon }: { label: string, score?: number, icon: React.ReactNode }) => {
  const getScoreColor = (score: number | undefined) => {
    if (!score) return 'bg-gray-100 text-gray-500';
    if (score >= 90) return 'bg-green-100 text-green-700';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-card border">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getScoreColor(score)}`}>
        <span className="text-lg font-bold">{!score ? '—' : Math.round(score)}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-center font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
};

// Helper component for metric items
const MetricItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
    <span className="text-sm">{label}</span>
    <Badge variant="outline" className="font-mono bg-primary/5">
      {value}
    </Badge>
  </div>
);

export default PageSpeedTab;
