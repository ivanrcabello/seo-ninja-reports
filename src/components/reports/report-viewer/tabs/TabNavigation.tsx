
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Report } from '@/types/report.types';
import { 
  FileBarChart, 
  Layers, 
  SearchCode, 
  KeyRound, 
  FileText, 
  Globe, 
  Gauge, 
  CheckCircle2, 
  LightbulbIcon 
} from 'lucide-react';

interface TabNavigationProps {
  content: Report['content'];
  hasPageSpeedData: boolean;
  isLoadingPageSpeed: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  content, 
  hasPageSpeedData, 
  isLoadingPageSpeed 
}) => {
  if (!content) return null;

  return (
    <div className="bg-background/80 backdrop-blur-sm sticky top-0 z-10 pb-2">
      <TabsList className="mb-4 flex h-auto p-1 justify-start overflow-x-auto w-full">
        {content.executiveSummary && (
          <TabsTrigger value="executiveSummary" className="flex items-center gap-1 py-2">
            <FileBarChart className="h-4 w-4" />
            <span>Resumen Ejecutivo</span>
          </TabsTrigger>
        )}
        {content.technicalAnalysis && (
          <TabsTrigger value="technicalAnalysis" className="flex items-center gap-1 py-2">
            <SearchCode className="h-4 w-4" />
            <span>SEO Técnico</span>
          </TabsTrigger>
        )}
        {content.keywords && (
          <TabsTrigger value="keywords" className="flex items-center gap-1 py-2">
            <KeyRound className="h-4 w-4" />
            <span>Palabras Clave</span>
          </TabsTrigger>
        )}
        {content.contentAnalysis && (
          <TabsTrigger value="contentAnalysis" className="flex items-center gap-1 py-2">
            <FileText className="h-4 w-4" />
            <span>Análisis de Contenido</span>
          </TabsTrigger>
        )}
        {content.backlinksAnalysis && (
          <TabsTrigger value="backlinksAnalysis" className="flex items-center gap-1 py-2">
            <Layers className="h-4 w-4" />
            <span>Backlinks</span>
          </TabsTrigger>
        )}
        {content.localSeo && (
          <TabsTrigger value="localSeo" className="flex items-center gap-1 py-2">
            <Globe className="h-4 w-4" />
            <span>SEO Local</span>
          </TabsTrigger>
        )}
        {(hasPageSpeedData || isLoadingPageSpeed) && (
          <TabsTrigger value="pageSpeedData" className="flex items-center gap-1 py-2">
            <Gauge className="h-4 w-4" />
            <span>PageSpeed</span>
          </TabsTrigger>
        )}
        {content.recommendations && (
          <TabsTrigger value="recommendations" className="flex items-center gap-1 py-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Recomendaciones</span>
          </TabsTrigger>
        )}
        {content.serviceProposal && (
          <TabsTrigger value="serviceProposal" className="flex items-center gap-1 py-2">
            <LightbulbIcon className="h-4 w-4" />
            <span>Propuesta</span>
          </TabsTrigger>
        )}
      </TabsList>
    </div>
  );
};

export default TabNavigation;
