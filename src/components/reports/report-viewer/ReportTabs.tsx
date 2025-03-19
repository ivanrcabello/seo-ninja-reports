
import React from 'react';
import { Report } from '@/types/report.types';
import { Tabs } from "@/components/ui/tabs";
import TabNavigation from './tabs/TabNavigation';
import TabContent from './tabs/TabContent';
import { getDefaultTab } from './tabs/getDefaultTab';

interface ReportTabsProps {
  report: Report;
  pageSpeedData?: any;
  isLoadingPageSpeed?: boolean;
  isEditing?: boolean;
  onEdit?: (sectionKey: string) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ 
  report, 
  pageSpeedData, 
  isLoadingPageSpeed = false,
  isEditing = false,
  onEdit = () => {}
}) => {
  const { content } = report;

  if (!content) {
    return <p>No hay contenido disponible.</p>;
  }

  // Verificamos si hay datos de PageSpeed, ya sea de la base de datos o del contenido del informe
  const hasPageSpeedData = pageSpeedData || content?.pageSpeedData;

  return (
    <Tabs defaultValue={getDefaultTab(content)} className="w-full">
      {/* Tabs Navigation */}
      <TabNavigation 
        content={content} 
        hasPageSpeedData={!!hasPageSpeedData} 
        isLoadingPageSpeed={isLoadingPageSpeed} 
      />
      
      {/* Tabs Content */}
      <TabContent 
        report={report}
        pageSpeedData={pageSpeedData}
        isLoadingPageSpeed={isLoadingPageSpeed}
        isEditing={isEditing}
        onEdit={onEdit}
      />
    </Tabs>
  );
};

export default ReportTabs;
