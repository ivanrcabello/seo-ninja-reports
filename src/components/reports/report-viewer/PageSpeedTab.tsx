
import React from 'react';

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
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Datos de PageSpeed</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">Escritorio</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Rendimiento:</span>
              <span className="font-medium">{data.desktop.performance}</span>
            </div>
            <div className="flex justify-between">
              <span>Accesibilidad:</span>
              <span className="font-medium">{data.desktop.accessibility}</span>
            </div>
            <div className="flex justify-between">
              <span>Mejores Prácticas:</span>
              <span className="font-medium">{data.desktop.bestPractices}</span>
            </div>
            <div className="flex justify-between">
              <span>SEO:</span>
              <span className="font-medium">{data.desktop.seo}</span>
            </div>
            {data.desktop.firstContentfulPaint && (
              <div className="flex justify-between">
                <span>First Contentful Paint:</span>
                <span className="font-medium">{data.desktop.firstContentfulPaint}s</span>
              </div>
            )}
            {data.desktop.speedIndex && (
              <div className="flex justify-between">
                <span>Speed Index:</span>
                <span className="font-medium">{data.desktop.speedIndex}s</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">Móvil</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Rendimiento:</span>
              <span className="font-medium">{data.mobile.performance}</span>
            </div>
            <div className="flex justify-between">
              <span>Accesibilidad:</span>
              <span className="font-medium">{data.mobile.accessibility}</span>
            </div>
            <div className="flex justify-between">
              <span>Mejores Prácticas:</span>
              <span className="font-medium">{data.mobile.bestPractices}</span>
            </div>
            <div className="flex justify-between">
              <span>SEO:</span>
              <span className="font-medium">{data.mobile.seo}</span>
            </div>
            {data.mobile.firstContentfulPaint && (
              <div className="flex justify-between">
                <span>First Contentful Paint:</span>
                <span className="font-medium">{data.mobile.firstContentfulPaint}s</span>
              </div>
            )}
            {data.mobile.speedIndex && (
              <div className="flex justify-between">
                <span>Speed Index:</span>
                <span className="font-medium">{data.mobile.speedIndex}s</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageSpeedTab;
