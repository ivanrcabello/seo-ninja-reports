
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageSpeedResult } from '@/types/report.types';
import { Loader2 } from 'lucide-react';
import ScoreCard from './ScoreCard';
import MetricItem from './MetricItem';
import EmptyState from './EmptyState';

interface DeviceScoreCardProps {
  title: string;
  subtitle: string;
  data?: PageSpeedResult;
  isLoading?: boolean;
}

const DeviceScoreCard: React.FC<DeviceScoreCardProps> = ({
  title,
  subtitle,
  data,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardHeader>
        <CardContent>
          <EmptyState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <ScoreCard title="Performance" score={data.performance} primary />
          <ScoreCard title="Accessibility" score={data.accessibility} />
          <ScoreCard title="Best Practices" score={data.bestPractices} />
          <ScoreCard title="SEO" score={data.seo} />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Core Web Vitals</h4>
          <div className="space-y-2">
            <MetricItem 
              name="First Contentful Paint (FCP)" 
              value={data.firstContentfulPaint} 
              unit="s" 
            />
            <MetricItem 
              name="Speed Index (SI)" 
              value={data.speedIndex} 
              unit="s" 
            />
            <MetricItem 
              name="Largest Contentful Paint (LCP)" 
              value={data.largestContentfulPaint} 
              unit="s" 
            />
            <MetricItem 
              name="Time to Interactive (TTI)" 
              value={data.timeToInteractive} 
              unit="s" 
            />
            <MetricItem 
              name="Total Blocking Time (TBT)" 
              value={data.totalBlockingTime} 
              unit="ms" 
            />
            <MetricItem 
              name="Cumulative Layout Shift (CLS)" 
              value={data.cumulativeLayoutShift} 
              isCLS 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceScoreCard;
