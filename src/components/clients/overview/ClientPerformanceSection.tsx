
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import ClientBusinessCard from './ClientBusinessCard';
import ClientPageSpeedCard from './ClientPageSpeedCard';

interface ClientPerformanceSectionProps {
  businessProfile: Partial<BusinessProfile> | null;
  pageSpeedScore: number | null;
  clientWebsite: string;
  onRefreshPageSpeed: () => void;
  onRefreshBusinessProfile: () => void;
  isRefreshingPageSpeed: boolean;
  isRefreshingBusinessProfile: boolean;
}

const ClientPerformanceSection: React.FC<ClientPerformanceSectionProps> = ({
  businessProfile,
  pageSpeedScore,
  clientWebsite,
  onRefreshPageSpeed,
  onRefreshBusinessProfile,
  isRefreshingPageSpeed,
  isRefreshingBusinessProfile
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <ClientBusinessCard 
        businessProfile={businessProfile}
        isRefreshingBusinessProfile={isRefreshingBusinessProfile}
        onRefreshBusinessProfile={onRefreshBusinessProfile}
      />
      
      <ClientPageSpeedCard 
        pageSpeedScore={pageSpeedScore}
        isRefreshingPageSpeed={isRefreshingPageSpeed}
        onRefreshPageSpeed={onRefreshPageSpeed}
      />
    </div>
  );
};

export default ClientPerformanceSection;
