
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import ClientPerformanceCards from '../ClientPerformanceCards';

interface ClientPerformanceSectionProps {
  businessProfile: Partial<BusinessProfile> | null;
  pageSpeedScore: number | null | undefined;
  clientWebsite: string;
  clientName?: string;
  clientLocation?: string;
  clientId?: string; // Add clientId prop
  onRefreshPageSpeed: () => void;
  onRefreshBusinessProfile: () => void;
  isRefreshingPageSpeed: boolean;
  isRefreshingBusinessProfile: boolean;
}

const ClientPerformanceSection: React.FC<ClientPerformanceSectionProps> = ({
  businessProfile,
  pageSpeedScore,
  clientWebsite,
  clientName,
  clientLocation,
  clientId, // Add clientId
  onRefreshPageSpeed,
  onRefreshBusinessProfile,
  isRefreshingPageSpeed,
  isRefreshingBusinessProfile
}) => {
  return (
    <section>
      <ClientPerformanceCards
        businessProfile={businessProfile}
        pageSpeedScore={pageSpeedScore}
        clientWebsite={clientWebsite}
        clientName={clientName}
        clientLocation={clientLocation}
        clientId={clientId} // Pass clientId
        onRefreshPageSpeed={onRefreshPageSpeed}
        onRefreshBusinessProfile={onRefreshBusinessProfile}
        isRefreshingPageSpeed={isRefreshingPageSpeed}
        isRefreshingBusinessProfile={isRefreshingBusinessProfile}
      />
    </section>
  );
};

export default ClientPerformanceSection;
