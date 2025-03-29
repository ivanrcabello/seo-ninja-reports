
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Gauge, Search, TrendingUp, MessageSquare, Map, Building } from 'lucide-react';

interface ReportTabsProps {
  tabCount: number;
  hasLocalSeo: boolean;
  hasProposal: boolean;
  hasKeywords: boolean;
  hasBusinessProfile: boolean;
}

const ReportTabs = ({ 
  tabCount, 
  hasLocalSeo, 
  hasProposal, 
  hasKeywords,
  hasBusinessProfile
}: ReportTabsProps) => {
  // Calculate grid columns based on tab count
  const gridCols = `grid-cols-${Math.min(tabCount, 4)} md:grid-cols-${Math.min(tabCount, 7)} lg:grid-cols-${tabCount}`;
  
  return (
    <TabsList className={`grid ${gridCols} mb-8`}>
      <TabsTrigger value="executive-summary" className="flex items-center gap-1">
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Resumen</span>
      </TabsTrigger>
      
      <TabsTrigger value="technical" className="flex items-center gap-1">
        <Gauge className="h-4 w-4" />
        <span className="hidden sm:inline">Técnico</span>
      </TabsTrigger>
      
      <TabsTrigger value="content" className="flex items-center gap-1">
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Contenido</span>
      </TabsTrigger>
      
      <TabsTrigger value="backlinks" className="flex items-center gap-1">
        <TrendingUp className="h-4 w-4" />
        <span className="hidden sm:inline">Backlinks</span>
      </TabsTrigger>
      
      <TabsTrigger value="recommendations" className="flex items-center gap-1">
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Recomend.</span>
      </TabsTrigger>
      
      {hasLocalSeo && (
        <TabsTrigger value="local-seo" className="flex items-center gap-1">
          <Map className="h-4 w-4" />
          <span className="hidden sm:inline">Local SEO</span>
        </TabsTrigger>
      )}
      
      {hasProposal && (
        <TabsTrigger value="proposal" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Propuesta</span>
        </TabsTrigger>
      )}
      
      {hasKeywords && (
        <TabsTrigger value="keywords" className="flex items-center gap-1">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Keywords</span>
        </TabsTrigger>
      )}
      
      {hasBusinessProfile && (
        <TabsTrigger value="business-profile" className="flex items-center gap-1">
          <Building className="h-4 w-4" />
          <span className="hidden sm:inline">Negocio</span>
        </TabsTrigger>
      )}
    </TabsList>
  );
};

export default ReportTabs;
