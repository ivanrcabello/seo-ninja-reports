
import React, { useState, useEffect } from 'react';
import { Client } from '@/types/client.types';
import { Report, BusinessProfile } from '@/types/report.types';
import { fetchPageSpeedData } from '@/services/api/pagespeed';
import { toast } from 'sonner';
import { extractValueserpData } from '@/services/api/businessProfile/extractValueserpData';

// Importing refactored components
import ClientInfoCards from './overview/ClientInfoCards';
import ClientPerformanceSection from './overview/ClientPerformanceSection';
import ClientTabsSection from './overview/ClientTabsSection';

interface ClientOverviewProps {
  client: Client;
  reports: Report[];
  onViewReports: () => void;
  onCreateReport: () => void;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ 
  client, 
  reports, 
  onViewReports, 
  onCreateReport 
}) => {
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [pageSpeedScore, setPageSpeedScore] = useState<number | null>(null);
  const [isRefreshingPageSpeed, setIsRefreshingPageSpeed] = useState(false);
  const [isRefreshingBusinessProfile, setIsRefreshingBusinessProfile] = useState(false);
  
  const latestReport = reports.length > 0 ? reports[0] : null;
  
  // Use the latest report's business profile as initial data if available
  useEffect(() => {
    if (latestReport?.content?.businessProfile && !businessProfile) {
      setBusinessProfile(latestReport.content.businessProfile);
    }
  }, [latestReport, businessProfile]);
  
  const reportBusinessProfile = latestReport?.content?.businessProfile || null;
  const reportPageSpeedScore = latestReport?.content?.pageSpeedData?.desktop?.performance 
    ? Math.round(latestReport.content.pageSpeedData.desktop.performance * 100) 
    : null;
  
  const displayBusinessProfile = businessProfile || reportBusinessProfile;
  const displayPageSpeedScore = pageSpeedScore !== null ? pageSpeedScore : reportPageSpeedScore;
  
  const handleRefreshPageSpeed = async () => {
    if (!client.website) {
      toast.error('No hay sitio web configurado para este cliente');
      return;
    }
    
    setIsRefreshingPageSpeed(true);
    
    try {
      const result = await fetchPageSpeedData(client.website);
      
      if (result && result.desktop && typeof result.desktop.performance !== 'undefined') {
        const desktopScore = Math.round(result.desktop.performance * 100);
        setPageSpeedScore(desktopScore);
        toast.success('Datos de rendimiento actualizados');
      } else {
        toast.error('No se pudieron obtener datos de rendimiento');
      }
    } catch (error) {
      console.error('Error refreshing PageSpeed data:', error);
      toast.error('Error al obtener datos de rendimiento');
    } finally {
      setIsRefreshingPageSpeed(false);
    }
  };
  
  const handleRefreshBusinessProfile = async () => {
    setIsRefreshingBusinessProfile(true);
    
    try {
      // Cambio para usar exclusivamente ValueSerp
      toast.info('Consultando API de ValueSerp', {
        description: 'Extrayendo información detallada del negocio...',
      });
      
      // Usamos el nombre del cliente para buscar con ValueSerp
      const result = await extractValueserpData(client.name, client.industry || '');
      
      if (result) {
        setBusinessProfile(result);
        
        const isSimulated = result.businessName === 'Negocio de ejemplo' || 
                          result.businessName?.includes('ejemplo');
                          
        if (isSimulated) {
          toast.warning('Datos simulados obtenidos', {
            description: 'Intenta refinar la búsqueda con ubicación específica'
          });
        } else {
          toast.success('Datos de negocio actualizados correctamente con ValueSerp');
        }
      } else {
        toast.error('No se pudieron obtener datos del negocio');
      }
    } catch (error) {
      console.error('Error refreshing business profile:', error);
      toast.error('Error al actualizar datos de negocio');
    } finally {
      setIsRefreshingBusinessProfile(false);
    }
  };
  
  const handleBusinessProfileUpdate = (profile: Partial<BusinessProfile>) => {
    setBusinessProfile(profile);
    toast.success('Perfil de negocio actualizado en la tarjeta de rendimiento');
  };
  
  const handlePageSpeedUpdate = (score: number) => {
    setPageSpeedScore(score);
    toast.success('Puntuación de rendimiento actualizada en la tarjeta de rendimiento');
  };

  return (
    <>
      {/* Client Info Cards Section */}
      <ClientInfoCards client={client} reports={reports} />
      
      {/* Client Performance Cards Section */}
      <ClientPerformanceSection 
        businessProfile={displayBusinessProfile}
        pageSpeedScore={displayPageSpeedScore}
        clientWebsite={client.website}
        clientName={client.name}
        clientLocation={client.industry}
        onRefreshPageSpeed={handleRefreshPageSpeed}
        onRefreshBusinessProfile={handleRefreshBusinessProfile}
        isRefreshingPageSpeed={isRefreshingPageSpeed}
        isRefreshingBusinessProfile={isRefreshingBusinessProfile}
      />
      
      {/* Client Tabs Section */}
      <ClientTabsSection 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        client={client}
        reports={reports}
        onViewReports={onViewReports}
        onCreateReport={onCreateReport}
        onBusinessProfileUpdate={handleBusinessProfileUpdate}
        onPageSpeedUpdate={handlePageSpeedUpdate}
      />
    </>
  );
};

export default ClientOverview;
