
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import { ClientPerformanceCards } from '../ClientPerformanceCards';

interface ClientPerformanceSectionProps {
  businessProfile: Partial<BusinessProfile> | null;
  pageSpeedScore: number | null;
  clientWebsite: string;
  clientName?: string; // Nuevo prop para el nombre del cliente
  clientLocation?: string; // Nuevo prop para la ubicación del cliente
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
      clientName={clientName}
      clientLocation={clientLocation}
      onRefreshPageSpeed={onRefreshPageSpeed}
      onRefreshBusinessProfile={onRefreshBusinessProfile}
      isRefreshingPageSpeed={isRefreshingPageSpeed}
      isRefreshingBusinessProfile={isRefreshingBusinessProfile}
    />
  );
};

export default ClientPerformanceSection;
