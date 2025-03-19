
import React from 'react';
import { Gauge, Smartphone, Monitor, ZapOff } from 'lucide-react';
import DeviceScoreCard from './DeviceScoreCard';
import EmptyState from './EmptyState';
import { formatTimeMetric } from './utils';

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
  // Verify if data exists and has the expected structure
  if (!data || (!data.desktop && !data.mobile)) {
    console.log('No PageSpeed data available', data);
    return <EmptyState />;
  }
  
  // Checking if there's valid data for desktop and mobile
  const hasDesktopData = data.desktop && Object.keys(data.desktop).length > 0;
  const hasMobileData = data.mobile && Object.keys(data.mobile).length > 0;
  
  console.log('PageSpeed data:', data);
  console.log('Has desktop data:', hasDesktopData, data.desktop);
  console.log('Has mobile data:', hasMobileData, data.mobile);

  if (!hasDesktopData && !hasMobileData) {
    return <EmptyState />;
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Gauge className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Rendimiento de la página</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desktop Score Card */}
        {hasDesktopData && (
          <DeviceScoreCard
            device="desktop"
            title="Escritorio"
            icon={<Monitor className="h-5 w-5 text-primary" />}
            data={data.desktop}
          />
        )}

        {/* Mobile Score Card */}
        {hasMobileData && (
          <DeviceScoreCard
            device="mobile"
            title="Móvil"
            icon={<Smartphone className="h-5 w-5 text-primary" />}
            data={data.mobile}
          />
        )}
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

export default PageSpeedTab;
