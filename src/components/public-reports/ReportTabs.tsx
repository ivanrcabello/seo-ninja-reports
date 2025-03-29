
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReportTabsProps {
  tabCount: number;
  hasLocalSeo: boolean;
  hasProposal: boolean;
  hasKeywords: boolean;
  hasBusinessProfile: boolean;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ 
  tabCount, 
  hasLocalSeo, 
  hasProposal, 
  hasKeywords,
  hasBusinessProfile 
}) => {
  // Determine grid columns class based on tab count
  const getGridClass = () => {
    switch(tabCount) {
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      case 7: return 'grid-cols-7';
      case 8: return 'grid-cols-8';
      case 9: return 'grid-cols-9';
      default: return 'grid-cols-5';
    }
  };
  
  return (
    <TabsList className={`grid ${getGridClass()} mb-8`}>
      <TabsTrigger value="executive-summary">Resumen</TabsTrigger>
      <TabsTrigger value="technical">Técnico</TabsTrigger>
      <TabsTrigger value="content">Contenido</TabsTrigger>
      <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
      <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
      
      {hasLocalSeo && <TabsTrigger value="local-seo">SEO Local</TabsTrigger>}
      {hasProposal && <TabsTrigger value="proposal">Propuesta</TabsTrigger>}
      {hasKeywords && <TabsTrigger value="keywords">Keywords</TabsTrigger>}
      {hasBusinessProfile && <TabsTrigger value="business-profile">Negocio</TabsTrigger>}
    </TabsList>
  );
};

export default ReportTabs;
