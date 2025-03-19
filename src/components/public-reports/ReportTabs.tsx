
import React from 'react';
import { TabsList } from '@/components/ui/tabs';
import TabItem from './TabItem';
import { Info, CheckCircle, ArrowUp, ArrowDown, AlertTriangle, MapPin, Star, FileText, Building } from 'lucide-react';

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
  // Calculate grid columns based on tab count
  const gridCols = tabCount <= 5 ? 5 : (tabCount <= 7 ? 4 : 3);
  
  return (
    <TabsList className={`w-full grid grid-cols-2 md:grid-cols-${gridCols} h-auto p-1 bg-gradient-to-r from-primary/5 to-background backdrop-blur-sm rounded-lg border border-primary/10`}>
      <TabItem 
        value="executive-summary" 
        icon={Info} 
        label="Resumen Ejecutivo" 
        shortLabel="Resumen" 
      />
      <TabItem 
        value="technical" 
        icon={CheckCircle} 
        label="Técnico" 
        shortLabel="Técnico" 
      />
      <TabItem 
        value="content" 
        icon={ArrowUp} 
        label="Contenido" 
        shortLabel="Contenido" 
      />
      <TabItem 
        value="backlinks" 
        icon={ArrowDown} 
        label="Backlinks" 
        shortLabel="Backlinks" 
      />
      <TabItem 
        value="recommendations" 
        icon={AlertTriangle} 
        label="Recomendaciones" 
        shortLabel="Recom." 
      />
      
      {hasLocalSeo && (
        <TabItem 
          value="local-seo" 
          icon={MapPin} 
          label="SEO Local" 
          shortLabel="Local" 
        />
      )}
      
      {hasProposal && (
        <TabItem 
          value="proposal" 
          icon={Star} 
          label="Propuesta" 
          shortLabel="Propuesta" 
        />
      )}
      
      {hasKeywords && (
        <TabItem 
          value="keywords" 
          icon={FileText} 
          label="Palabras Clave" 
          shortLabel="Keywords" 
        />
      )}
      
      {hasBusinessProfile && (
        <TabItem 
          value="business-profile" 
          icon={Building} 
          label="Ficha de Negocio" 
          shortLabel="GMB" 
        />
      )}
    </TabsList>
  );
};

export default ReportTabs;
