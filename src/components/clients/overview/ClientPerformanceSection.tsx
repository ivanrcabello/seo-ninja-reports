
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import ClientBusinessCard from './ClientBusinessCard';
import { ClientPerformanceCards } from '../ClientPerformanceCards';

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
    <ClientPerformanceCards
      businessProfile={businessProfile}
      pageSpeedScore={pageSpeedScore}
      clientWebsite={clientWebsite}
      onRefreshPageSpeed={onRefreshPageSpeed}
      onRefreshBusinessProfile={onRefreshBusinessProfile}
      isRefreshingPageSpeed={isRefreshingPageSpeed}
      isRefreshingBusinessProfile={isRefreshingBusinessProfile}
    />
  );
};

export default ClientPerformanceSection;
