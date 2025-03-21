
import React from 'react';
import { Report, BusinessProfile } from '@/types/report.types';
import { Tabs } from "@/components/ui/tabs";
import TabNavigation from './tabs/TabNavigation';
import TabContent from './tabs/TabContent';
import { getDefaultTab } from './tabs/getDefaultTab';

interface ReportTabsProps {
  report: Report;
  pageSpeedData?: any;
  businessProfile?: BusinessProfile | null;
  isLoadingPageSpeed?: boolean;
  isLoadingBusinessProfile?: boolean;
  isEditing?: boolean;
  onEdit?: (sectionKey: string, content: string) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ 
  report, 
  pageSpeedData, 
  businessProfile,
  isLoadingPageSpeed = false,
  isLoadingBusinessProfile = false,
  isEditing = false,
  onEdit = () => {}
}) => {
  const { content } = report;

  if (!content) {
    return <p>No hay contenido disponible.</p>;
  }

  // Verificamos si hay datos de PageSpeed, ya sea de la base de datos o del contenido del informe
  const hasPageSpeedData = pageSpeedData || content?.pageSpeedData;
  
  // Verificamos si hay datos de perfil de negocio, ya sea de la base de datos o del contenido del informe
  const hasBusinessProfile = businessProfile || content?.businessProfile;

  return (
    <Tabs defaultValue={getDefaultTab(content)} className="w-full">
      {/* Tabs Navigation */}
      <TabNavigation 
        content={content} 
        hasPageSpeedData={!!hasPageSpeedData} 
        hasBusinessProfile={!!hasBusinessProfile}
        isLoadingPageSpeed={isLoadingPageSpeed}
        isLoadingBusinessProfile={isLoadingBusinessProfile}
        reportId={report.id} 
      />
      
      {/* Tabs Content */}
      <TabContent 
        report={report}
        pageSpeedData={pageSpeedData}
        businessProfile={businessProfile}
        isLoadingPageSpeed={isLoadingPageSpeed}
        isLoadingBusinessProfile={isLoadingBusinessProfile}
        isEditing={isEditing}
        onEdit={onEdit}
      />
    </Tabs>
  );
};

export default ReportTabs;
