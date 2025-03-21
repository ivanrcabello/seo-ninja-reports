
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Report, BusinessProfile } from '@/types/report.types';
import ReportSection from '../report-section';
import PageSpeedTab from './pagespeed/PageSpeedTab';
import BusinessProfileTable from './business-profile/BusinessProfileTable';
import KeywordsSection from './keywords/KeywordsSection';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ReportTabsProps {
  report: Report;
  pageSpeedData?: any;
  businessProfile?: BusinessProfile | null;
  isLoadingPageSpeed: boolean;
  isLoadingBusinessProfile: boolean;
  isEditing: boolean;
  onEdit: (sectionKey: string, content: string) => void;
  onSaveBusinessProfile?: (profile: Partial<BusinessProfile>) => Promise<void>;
  isSavingBusinessProfile?: boolean;
}

const ReportTabs: React.FC<ReportTabsProps> = ({
  report,
  pageSpeedData,
  businessProfile,
  isLoadingPageSpeed,
  isLoadingBusinessProfile,
  isEditing,
  onEdit,
  onSaveBusinessProfile,
  isSavingBusinessProfile = false
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const reportContent = report.content || {};
  const hasKeywords = report.content?.keywords && Array.isArray(report.content.keywords) && report.content.keywords.length > 0;
  
  const getTabCount = () => {
    let count = 1; // "Content" tab is always present
    
    if (pageSpeedData || isLoadingPageSpeed) {
      count++;
    }
    
    if (businessProfile || isLoadingBusinessProfile || report.hasBusinessProfile) {
      count++;
    }
    
    if (hasKeywords) {
      count++;
    }
    
    return count;
  };
  
  const tabCount = getTabCount();
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="border-b px-6">
        <TabsList className="h-12 bg-transparent p-0">
          <TabsTrigger 
            value="content" 
            className="data-[state=active]:border-primary rounded-none h-12 border-b-2 border-transparent data-[state=active]:border-b-2 px-4"
          >
            Contenido
          </TabsTrigger>
          
          {(pageSpeedData || isLoadingPageSpeed) && (
            <TabsTrigger 
              value="pagespeed" 
              className="data-[state=active]:border-primary rounded-none h-12 border-b-2 border-transparent data-[state=active]:border-b-2 px-4"
            >
              PageSpeed
            </TabsTrigger>
          )}
          
          {(businessProfile || isLoadingBusinessProfile || report.hasBusinessProfile) && (
            <TabsTrigger 
              value="business-profile" 
              className="data-[state=active]:border-primary rounded-none h-12 border-b-2 border-transparent data-[state=active]:border-b-2 px-4"
            >
              Perfil GMB
            </TabsTrigger>
          )}
          
          {hasKeywords && (
            <TabsTrigger 
              value="keywords" 
              className="data-[state=active]:border-primary rounded-none h-12 border-b-2 border-transparent data-[state=active]:border-b-2 px-4"
            >
              Keywords
            </TabsTrigger>
          )}
        </TabsList>
      </div>
      
      <TabsContent value="content" className="p-6">
        <div className="space-y-8">
          {Object.entries(reportContent).map(([key, value]) => {
            // Skip non-section data
            if (
              key === 'rawHtml' || 
              key === 'pageSpeedData' || 
              key === 'keywords' || 
              key === 'businessProfile'
            ) {
              return null;
            }
            
            return (
              <ReportSection 
                key={key}
                title={key}
                content={value as string} 
                onEdit={isEditing ? (content) => onEdit(key, content) : undefined}
              />
            );
          })}
        </div>
      </TabsContent>
      
      <TabsContent value="pagespeed" className="pt-2">
        <PageSpeedTab 
          data={pageSpeedData} 
          isLoading={isLoadingPageSpeed} 
        />
      </TabsContent>
      
      <TabsContent value="business-profile" className="p-6">
        <BusinessProfileTable 
          businessProfile={businessProfile}
          isLoading={isLoadingBusinessProfile}
          onSaveBusinessProfile={onSaveBusinessProfile}
          isSaving={isSavingBusinessProfile}
          reportContent={reportContent}
        />
      </TabsContent>
      
      <TabsContent value="keywords" className="p-6">
        {hasKeywords && reportContent.keywords && (
          <KeywordsSection keywords={reportContent.keywords} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ReportTabs;
