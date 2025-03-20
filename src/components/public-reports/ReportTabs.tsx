
import React from 'react';
import { TabsList } from '@/components/ui/tabs';
import TabItem from './TabItem';
import { 
  Info, 
  CheckCircle, 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle, 
  MapPin, 
  Star, 
  FileText, 
  Building,
  ChevronRight
} from 'lucide-react';

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
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b border-primary/10">
      <TabsList className="w-full flex flex-wrap justify-center gap-1 h-auto p-2 bg-gradient-to-r from-primary/5 to-background backdrop-blur-sm rounded-lg border border-primary/10">
        <TabItem 
          value="executive-summary" 
          icon={Info} 
          label="Resumen Ejecutivo" 
          shortLabel="Resumen" 
          color="bg-primary/20 text-primary hover:bg-primary/30"
        />
        <TabItem 
          value="technical" 
          icon={CheckCircle} 
          label="Técnico" 
          shortLabel="Técnico" 
          color="bg-green-500/20 text-green-500 hover:bg-green-500/30"
        />
        <TabItem 
          value="content" 
          icon={ArrowUp} 
          label="Contenido" 
          shortLabel="Contenido" 
          color="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
        />
        <TabItem 
          value="backlinks" 
          icon={ArrowDown} 
          label="Backlinks" 
          shortLabel="Backlinks" 
          color="bg-purple-500/20 text-purple-500 hover:bg-purple-500/30"
        />
        <TabItem 
          value="recommendations" 
          icon={AlertTriangle} 
          label="Recomendaciones" 
          shortLabel="Recom." 
          color="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
        />
        
        {hasLocalSeo && (
          <TabItem 
            value="local-seo" 
            icon={MapPin} 
            label="SEO Local" 
            shortLabel="Local" 
            color="bg-red-500/20 text-red-500 hover:bg-red-500/30"
          />
        )}
        
        {hasProposal && (
          <TabItem 
            value="proposal" 
            icon={Star} 
            label="Propuesta" 
            shortLabel="Propuesta" 
            color="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
          />
        )}
        
        {hasKeywords && (
          <TabItem 
            value="keywords" 
            icon={FileText} 
            label="Palabras Clave" 
            shortLabel="Keywords" 
            color="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
          />
        )}
        
        {hasBusinessProfile && (
          <TabItem 
            value="business-profile" 
            icon={Building} 
            label="Ficha de Negocio" 
            shortLabel="GMB" 
            color="bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30"
          />
        )}
      </TabsList>
    </div>
  );
};

export default ReportTabs;
