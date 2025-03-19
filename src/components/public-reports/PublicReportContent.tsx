
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import ReportTabs from './ReportTabs';
import ReportContents from './ReportContents';

interface ReportContentType {
  executiveSummary: string;
  technicalAnalysis: string;
  contentAnalysis: string;
  backlinksAnalysis: string;
  recommendations: string;
  localSeo?: string;
  serviceProposal?: string;
  keywords?: string;
}

interface PublicReportContentProps {
  content: ReportContentType;
}

const PublicReportContent: React.FC<PublicReportContentProps> = ({ content }) => {
  // Calculate how many tabs to show based on available content
  const hasLocalSeo = content.localSeo && content.localSeo.trim() !== '';
  const hasProposal = content.serviceProposal && content.serviceProposal.trim() !== '';
  const hasKeywords = content.keywords && content.keywords.trim() !== '';
  
  // Count standard tabs (always show these 5)
  const tabCount = 5 + (hasLocalSeo ? 1 : 0) + (hasProposal ? 1 : 0) + (hasKeywords ? 1 : 0);
  
  return (
    <div className="w-full max-w-4xl">
      <Tabs defaultValue="executive-summary" className="w-full">
        <ReportTabs 
          tabCount={tabCount} 
          hasLocalSeo={hasLocalSeo} 
          hasProposal={hasProposal} 
          hasKeywords={hasKeywords} 
        />
        
        <ReportContents 
          content={content} 
          hasLocalSeo={hasLocalSeo} 
          hasProposal={hasProposal} 
          hasKeywords={hasKeywords} 
        />
      </Tabs>
    </div>
  );
};

export default PublicReportContent;
