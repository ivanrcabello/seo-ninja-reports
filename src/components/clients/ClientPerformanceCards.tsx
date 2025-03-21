
import React from 'react';
import { Gauge, MapPin } from 'lucide-react';
import { BusinessProfile } from '@/types/report.types';
import PerformanceCard from './overview/performance/PerformanceCard';
import BusinessProfileCardContent from './overview/performance/BusinessProfileCardContent';
import PageSpeedCardContent from './overview/performance/PageSpeedCardContent';
import { getScoreBadgeClasses, getScoreLabel } from './overview/performance/PerformanceUtils';

interface ClientPerformanceCardsProps {
  businessProfile: Partial<BusinessProfile> | null;
  pageSpeedScore?: number | null;
  clientWebsite: string;
  clientName?: string; // Nuevo prop para el nombre del cliente
  clientLocation?: string; // Nuevo prop para la ubicación del cliente
  onRefreshPageSpeed?: () => void;
  onRefreshBusinessProfile?: () => void;
  isRefreshingPageSpeed?: boolean;
  isRefreshingBusinessProfile?: boolean;
}

export const ClientPerformanceCards: React.FC<ClientPerformanceCardsProps> = ({ 
  businessProfile,
  pageSpeedScore,
  clientWebsite,
  clientName,
  clientLocation,
  onRefreshPageSpeed = () => {},
  onRefreshBusinessProfile = () => {},
  isRefreshingPageSpeed = false,
  isRefreshingBusinessProfile = false
}) => {
  const hasBusinessData = Boolean(businessProfile?.businessName);
  const hasPageSpeedData = pageSpeedScore !== undefined && pageSpeedScore !== null;
  const isSimulatedData = businessProfile?.businessName === 'Negocio de ejemplo' || 
                          businessProfile?.businessName?.includes('ejemplo');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Google Business Profile Card */}
      <PerformanceCard
        title="Perfil de Google Business"
        icon={<MapPin className="h-4 w-4 mr-2 text-primary" />}
        badgeText={hasBusinessData 
          ? (isSimulatedData ? "Simulado" : "Activo") 
          : "No configurado"
        }
        badgeClassName={hasBusinessData 
          ? (isSimulatedData 
              ? "bg-amber-100 text-amber-800 border-amber-200" 
              : "bg-green-100 text-green-800 border-green-200") 
          : "bg-gray-100 text-gray-800 border-gray-200"
        }
        isDataAvailable={hasBusinessData}
        onRefresh={onRefreshBusinessProfile}
        isRefreshing={isRefreshingBusinessProfile}
        tooltipText="Actualizar datos con ValueSerp"
      >
        <BusinessProfileCardContent
          businessProfile={businessProfile}
          isRefreshingBusinessProfile={isRefreshingBusinessProfile}
          onRefreshBusinessProfile={onRefreshBusinessProfile}
          clientName={clientName}
          clientLocation={clientLocation}
        />
      </PerformanceCard>
      
      {/* PageSpeed Card */}
      <PerformanceCard
        title="Rendimiento Web"
        icon={<Gauge className="h-4 w-4 mr-2 text-primary" />}
        badgeText={getScoreLabel(pageSpeedScore)}
        badgeClassName={getScoreBadgeClasses(pageSpeedScore)}
        isDataAvailable={hasPageSpeedData}
        onRefresh={onRefreshPageSpeed}
        isRefreshing={isRefreshingPageSpeed}
        tooltipText="Actualizar datos de rendimiento"
      >
        <PageSpeedCardContent
          pageSpeedScore={pageSpeedScore}
          isRefreshingPageSpeed={isRefreshingPageSpeed}
          onRefreshPageSpeed={onRefreshPageSpeed}
        />
      </PerformanceCard>
    </div>
  );
};

export default ClientPerformanceCards;
