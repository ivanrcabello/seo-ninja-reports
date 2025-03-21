
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Code, FileSearch, ExternalLink, 
  TrendingUp, MapPin, Briefcase, Search, Building2 
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
  // Calculate the width based on number of tabs
  const tabWidth = tabCount > 0 ? `${Math.min(100 / tabCount, 20)}%` : '20%';
  
  return (
    <TabsList className="mb-8 w-full h-auto flex flex-wrap bg-background/50 backdrop-blur-sm border p-1">
      <TabsTrigger 
        value="executive-summary" 
        className="py-2 data-[state=active]:bg-primary/10"
        style={{ width: tabWidth }}
      >
        <FileText className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Resumen</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="technical" 
        className="py-2 data-[state=active]:bg-green-500/10"
        style={{ width: tabWidth }}
      >
        <Code className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Técnico</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="content" 
        className="py-2 data-[state=active]:bg-blue-500/10"
        style={{ width: tabWidth }}
      >
        <FileSearch className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Contenido</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="backlinks" 
        className="py-2 data-[state=active]:bg-purple-500/10"
        style={{ width: tabWidth }}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Backlinks</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="recommendations" 
        className="py-2 data-[state=active]:bg-yellow-500/10"
        style={{ width: tabWidth }}
      >
        <TrendingUp className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Recomendaciones</span>
      </TabsTrigger>
      
      {hasLocalSeo && (
        <TabsTrigger 
          value="local-seo" 
          className="py-2 data-[state=active]:bg-red-500/10"
          style={{ width: tabWidth }}
        >
          <MapPin className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">SEO Local</span>
        </TabsTrigger>
      )}
      
      {hasProposal && (
        <TabsTrigger 
          value="proposal" 
          className="py-2 data-[state=active]:bg-orange-500/10"
          style={{ width: tabWidth }}
        >
          <Briefcase className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Propuesta</span>
        </TabsTrigger>
      )}
      
      {hasKeywords && (
        <TabsTrigger 
          value="keywords" 
          className="py-2 data-[state=active]:bg-emerald-500/10"
          style={{ width: tabWidth }}
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Keywords</span>
        </TabsTrigger>
      )}
      
      {hasBusinessProfile && (
        <TabsTrigger 
          value="business-profile" 
          className="py-2 data-[state=active]:bg-indigo-500/10"
          style={{ width: tabWidth }}
        >
          <Building2 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Ficha de Negocio</span>
        </TabsTrigger>
      )}
    </TabsList>
  );
};

export default ReportTabs;
