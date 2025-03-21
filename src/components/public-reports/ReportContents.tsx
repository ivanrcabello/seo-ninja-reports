
import React from 'react';
import { BusinessProfile } from '@/types/report.types';
import ContentTab from './ContentTab';

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
  // Extract keywords from the keywords section if available
  const keywords = React.useMemo(() => {
    if (!content.keywords) return [];
    
    try {
      // Try to extract keywords from markdown or structured format
      const keywordLines = content.keywords
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
        
      return keywordLines.map(line => {
        const keyword = line.replace(/^[-*]\s*/, '').trim();
        const nameMatch = keyword.match(/^(.*?)(\(|:|$)/);
        
        return {
          keyword: nameMatch ? nameMatch[1].trim() : keyword,
          searchVolume: keyword.includes('búsqueda') || keyword.includes('volumen') ? 
            parseInt(keyword.match(/\d+/)?.[0] || '0') : undefined,
          difficulty: keyword.includes('dificultad') ? 
            parseInt(keyword.match(/\d+/)?.[0] || '0') : undefined
        };
      });
    } catch (e) {
      console.error('Error parsing keywords from content:', e);
      return [];
    }
  }, [content.keywords]);
  
  return (
    <>
      <ContentTab 
        tabValue="executive-summary" 
        content={content} 
        keywords={keywords}
      />
      
      <ContentTab 
        tabValue="technical" 
        content={content} 
        keywords={keywords}
      />
      
      <ContentTab 
        tabValue="content" 
        content={content} 
        keywords={keywords}
      />
      
      <ContentTab 
        tabValue="backlinks" 
        content={content} 
        keywords={keywords}
      />
      
      <ContentTab 
        tabValue="recommendations" 
        content={content} 
        keywords={keywords}
      />
      
      {hasLocalSeo && (
        <ContentTab 
          tabValue="local-seo" 
          content={content} 
          keywords={keywords}
        />
      )}
      
      {hasProposal && (
        <ContentTab 
          tabValue="proposal" 
          content={content} 
          keywords={keywords}
        />
      )}
      
      {hasKeywords && (
        <ContentTab 
          tabValue="keywords" 
          content={content} 
          keywords={keywords}
        />
      )}
      
      {hasBusinessProfile && (
        <ContentTab 
          tabValue="business-profile" 
          content={content} 
          keywords={keywords}
        />
      )}
    </>
  );
};

export default ReportContents;
