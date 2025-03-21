
import React from 'react';
import { PageSpeedTab as PageSpeedTabComponent } from './pagespeed';

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
  isLoading?: boolean;
}

// This is a wrapper component to maintain backward compatibility
const PageSpeedTab: React.FC<PageSpeedDataProps> = ({ data, isLoading = false }) => {
  return <PageSpeedTabComponent data={data} isLoading={isLoading} />;
};

export default PageSpeedTab;
