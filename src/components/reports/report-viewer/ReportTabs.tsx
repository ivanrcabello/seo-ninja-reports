
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gauge, Search, FileText, MessageSquare, BarChart, TrendingUp, Map } from 'lucide-react';
import TabContent from './tabs/TabContent';
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
  const [activeTab, setActiveTab] = useState('executiveSummary');

  // Use pageSpeed data from props or fall back to data in the report
  const pageSpeedDataToUse = pageSpeedData || report.content?.pageSpeedData;
  
  // Check if the report contains PageSpeed data
  const hasPageSpeedData = pageSpeedDataToUse && 
    ((pageSpeedDataToUse.desktop && Object.keys(pageSpeedDataToUse.desktop).length > 0) || 
     (pageSpeedDataToUse.mobile && Object.keys(pageSpeedDataToUse.mobile).length > 0));
  
  // Check that keywords exists and has data
  const hasKeywordsData = report.content?.keywords && 
    typeof report.content.keywords === 'string' && 
    report.content.keywords.trim().length > 0;
  
  // Check if report has business profile data
  const hasBusinessProfile = businessProfile || report.content?.businessProfile;
  
  // Custom content from the report (additional tabs)
  const customSections = report.customSections || [];

  return (
    <Tabs 
      defaultValue="executiveSummary" 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-9 mb-8">
        <TabsTrigger value="executiveSummary" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Resumen</span>
        </TabsTrigger>
        
        {hasPageSpeedData && (
          <TabsTrigger value="pageSpeedData" className="flex items-center gap-1">
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
        
        <TabsTrigger value="contentAnalysis" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Contenido</span>
        </TabsTrigger>
        
        <TabsTrigger value="technicalAnalysis" className="flex items-center gap-1">
          <Gauge className="h-4 w-4" />
          <span className="hidden sm:inline">Técnico</span>
        </TabsTrigger>
        
        <TabsTrigger value="backlinksAnalysis" className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4" />
          <span className="hidden sm:inline">Backlinks</span>
        </TabsTrigger>
        
        {hasBusinessProfile && (
          <TabsTrigger value="localSeo" className="flex items-center gap-1">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Local SEO</span>
          </TabsTrigger>
        )}
        
        <TabsTrigger value="recommendations" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Recomend.</span>
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
      
      <TabContent 
        report={report} 
        pageSpeedData={pageSpeedDataToUse}
        businessProfile={businessProfile}
        isLoadingPageSpeed={isLoadingPageSpeed}
        isLoadingBusinessProfile={isLoadingBusinessProfile}
        isEditing={isEditing}
        onEdit={onSaveEdit}
      />
      
    </Tabs>
  );
};

export default ReportTabs;
