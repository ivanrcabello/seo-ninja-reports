
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gauge, Search, FileText, MessageSquare, BarChart } from 'lucide-react';
import ExecutiveSummaryTab from './ExecutiveSummaryTab';
import KeywordsTab from './KeywordsTab';
import OnPageTab from './OnPageTab';
import TechnicalTab from './TechnicalTab';
import LocalSEOTab from './LocalSEOTab';
import ContentTab from './ContentTab';
import CustomTabs from './CustomTabs';
import PageSpeedTab from './pagespeed/PageSpeedTab';
import { Report, PageSpeedData, BusinessProfile } from '@/types/report.types';

interface ReportTabsProps {
  report: Report;
  isEditing: boolean;
  onSaveEdit: (section: string, content: string) => Promise<void>;
  pageSpeedData?: PageSpeedData;
  businessProfile?: BusinessProfile;
  isLoadingPageSpeed?: boolean;
  isLoadingBusinessProfile?: boolean;
  isSavingBusinessProfile?: boolean;
  onSaveBusinessProfile?: (profileData: Partial<BusinessProfile>) => Promise<void>;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ 
  report, 
  isEditing, 
  onSaveEdit,
  pageSpeedData,
  businessProfile,
  isLoadingPageSpeed = false,
  isLoadingBusinessProfile = false,
  isSavingBusinessProfile = false,
  onSaveBusinessProfile
}) => {
  const [activeTab, setActiveTab] = useState('resumen');

  // Use pageSpeed data from props or fall back to data in the report
  const pageSpeedDataToUse = pageSpeedData || report.content?.pageSpeedData;
  
  // Verificar si el informe contiene datos de PageSpeed
  const hasPageSpeedData = pageSpeedDataToUse && 
    ((pageSpeedDataToUse.desktop && Object.keys(pageSpeedDataToUse.desktop).length > 0) || 
     (pageSpeedDataToUse.mobile && Object.keys(pageSpeedDataToUse.mobile).length > 0));
  
  // Verificar que keywords existe y tiene datos
  const hasKeywordsData = report.content?.keywords && 
    typeof report.content.keywords === 'string' && 
    report.content.keywords.trim().length > 0;
  
  // Custom content from the report (additional tabs)
  const customSections = report.customSections || [];

  return (
    <Tabs 
      defaultValue="resumen" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-9 mb-8">
        <TabsTrigger value="resumen" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Resumen</span>
        </TabsTrigger>
        
        {hasPageSpeedData && (
          <TabsTrigger value="pagespeed" className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">PageSpeed</span>
          </TabsTrigger>
        )}
        
        {hasKeywordsData && (
          <TabsTrigger value="keywords" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Keywords</span>
          </TabsTrigger>
        )}
        
        <TabsTrigger value="onpage" className="flex items-center gap-1">
          <BarChart className="h-4 w-4" />
          <span className="hidden sm:inline">On-Page</span>
        </TabsTrigger>
        
        <TabsTrigger value="tecnico" className="flex items-center gap-1">
          <Gauge className="h-4 w-4" />
          <span className="hidden sm:inline">Técnico</span>
        </TabsTrigger>
        
        <TabsTrigger value="localseo" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Local SEO</span>
        </TabsTrigger>
        
        <TabsTrigger value="contenido" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Contenido</span>
        </TabsTrigger>
        
        {customSections.map((section) => (
          <TabsTrigger 
            key={section.id} 
            value={section.id} 
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{section.title}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="resumen">
        <ExecutiveSummaryTab 
          content={report.content?.executiveSummary || ''} 
          isEditing={isEditing} 
          onSave={(content) => onSaveEdit('executiveSummary', content)}
        />
      </TabsContent>
      
      {hasPageSpeedData && (
        <TabsContent value="pagespeed">
          <PageSpeedTab data={pageSpeedDataToUse} isLoading={isLoadingPageSpeed} />
        </TabsContent>
      )}
      
      {hasKeywordsData && (
        <TabsContent value="keywords">
          <KeywordsTab 
            keywords={[]} 
            isEditing={isEditing}
            onSave={(content) => onSaveEdit('keywordsAnalysis', content)}
            keywordsAnalysis={report.content?.keywordsAnalysis || ''}
          />
        </TabsContent>
      )}
      
      <TabsContent value="onpage">
        <OnPageTab 
          content={report.content?.onPageSEO || ''} 
          isEditing={isEditing} 
          onSave={(content) => onSaveEdit('onPageSEO', content)}
        />
      </TabsContent>
      
      <TabsContent value="tecnico">
        <TechnicalTab 
          content={report.content?.technicalSEO || ''} 
          isEditing={isEditing} 
          onSave={(content) => onSaveEdit('technicalSEO', content)}
        />
      </TabsContent>
      
      <TabsContent value="localseo">
        <LocalSEOTab 
          content={report.content?.localSEO || ''} 
          isEditing={isEditing} 
          onSave={(content) => onSaveEdit('localSEO', content)}
          businessProfile={businessProfile || report.content?.businessProfile}
        />
      </TabsContent>
      
      <TabsContent value="contenido">
        <ContentTab 
          content={report.content?.contentStrategy || ''} 
          isEditing={isEditing} 
          onSave={(content) => onSaveEdit('contentStrategy', content)}
        />
      </TabsContent>
      
      <CustomTabs 
        customSections={customSections} 
        isEditing={isEditing} 
        onSaveEdit={onSaveEdit}
      />
    </Tabs>
  );
};

export default ReportTabs;
