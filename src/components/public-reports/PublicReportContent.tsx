
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import ReportTabs from './ReportTabs';
import ReportContents from './ReportContents';
import { BusinessProfile } from '@/types/report.types';

interface ReportContentType {
  executiveSummary: string;
  technicalAnalysis: string;
  contentAnalysis: string;
  backlinksAnalysis: string;
  recommendations: string;
  localSeo?: string;
  serviceProposal?: string;
  keywords?: string;
  businessProfile?: BusinessProfile;
}

interface PublicReportContentProps {
  content: ReportContentType;
}

const PublicReportContent: React.FC<PublicReportContentProps> = ({ content }) => {
  // Calculate how many tabs to show based on available content
  const hasLocalSeo = content.localSeo && content.localSeo.trim() !== '';
  const hasProposal = content.serviceProposal && content.serviceProposal.trim() !== '';
  const hasKeywords = content.keywords && content.keywords.trim() !== '';
  const hasBusinessProfile = content.businessProfile && content.businessProfile.businessUrl;
  
  // Count standard tabs (always show these 5)
  const tabCount = 5 + 
    (hasLocalSeo ? 1 : 0) + 
    (hasProposal ? 1 : 0) + 
    (hasKeywords ? 1 : 0) + 
    (hasBusinessProfile ? 1 : 0);
  
  return (
    <div className="w-full max-w-4xl">
      <Tabs defaultValue="executive-summary" className="w-full">
        <ReportTabs 
          tabCount={tabCount} 
          hasLocalSeo={hasLocalSeo} 
          hasProposal={hasProposal} 
          hasKeywords={hasKeywords}
          hasBusinessProfile={hasBusinessProfile}
        />
        
        <ReportContents 
          content={content} 
          hasLocalSeo={hasLocalSeo} 
          hasProposal={hasProposal} 
          hasKeywords={hasKeywords}
          hasBusinessProfile={hasBusinessProfile}
        />
      </Tabs>
    </div>
  );
};

export default PublicReportContent;
