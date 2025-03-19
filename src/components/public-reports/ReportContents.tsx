
import React from 'react';
import ContentTab from './ContentTab';
import { Info, CheckCircle, ArrowUp, ArrowDown, AlertTriangle, MapPin, Star, FileText, Building } from 'lucide-react';
import { BusinessProfile } from '@/types/report.types';

interface ReportContentsProps {
  content: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    recommendations: string;
    localSeo?: string;
    serviceProposal?: string;
    keywords?: string;
    businessProfile?: BusinessProfile;
  };
  hasLocalSeo: boolean;
  hasProposal: boolean;
  hasKeywords: boolean;
  hasBusinessProfile: boolean;
}

const ReportContents: React.FC<ReportContentsProps> = ({ 
  content, 
  hasLocalSeo, 
  hasProposal, 
  hasKeywords,
  hasBusinessProfile
}) => {
  return (
    <>
      <ContentTab 
        tabValue="executive-summary" 
        content={content}
      />
      
      <ContentTab 
        tabValue="technical" 
        content={content}
      />
      
      <ContentTab 
        tabValue="content" 
        content={content}
      />
      
      <ContentTab 
        tabValue="backlinks" 
        content={content}
      />
      
      <ContentTab 
        tabValue="recommendations" 
        content={content}
      />
      
      {hasLocalSeo && (
        <ContentTab 
          tabValue="local-seo" 
          content={content}
        />
      )}
      
      {hasProposal && (
        <ContentTab 
          tabValue="proposal" 
          content={content}
        />
      )}
      
      {hasKeywords && (
        <ContentTab 
          tabValue="keywords" 
          content={content}
        />
      )}
      
      {hasBusinessProfile && content.businessProfile && (
        <ContentTab 
          tabValue="business-profile" 
          content={content}
        />
      )}
    </>
  );
};

export default ReportContents;
