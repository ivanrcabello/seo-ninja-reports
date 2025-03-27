import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BusinessProfile } from '@/types/report.types';
import { SeoReport } from '@/types/seo-reporting.types';
import { CrawlResult } from '@/services/seo-crawler/types';

interface Keyword {
  keyword: string;
  searchVolume?: string;
  difficulty?: string;
}

interface ReportGeneratorContextType {
  // SEO Crawler data
  crawlId?: string;
  crawlData?: CrawlResult;
  useCrawlData: boolean;
  setUseCrawlData: (use: boolean) => void;
  setCrawlId: (id?: string) => void;
  setCrawlData: (data?: CrawlResult) => void;
  
  // Page Speed data
  pageSpeedData: any;
  usePageSpeedData: boolean;
  setPageSpeedData: (data: any) => void;
  setUsePageSpeedData: (use: boolean) => void;
  
  // URL
  url: string;
  setUrl: (url: string) => void;
  
  // Business profile
  businessUrl: string;
  businessProfile: Partial<BusinessProfile> | null;
  useGmbData: boolean;
  setBusinessUrl: (url: string) => void;
  setBusinessProfile: (profile: Partial<BusinessProfile> | null) => void;
  setUseGmbData: (use: boolean) => void;
  
  // Keywords
  keywords: Keyword[];
  useKeywordsData: boolean;
  setKeywords: (keywords: Keyword[]) => void;
  setUseKeywordsData: (use: boolean) => void;
  
  // Other settings
  customPrompt: string;
  notes: string;
  files: File[];
  seoReports: SeoReport[];
  selectedSeoReport: string | null;
  setCustomPrompt: (prompt: string) => void;
  setNotes: (notes: string) => void;
  setFiles: (files: File[]) => void;
  setSeoReports: (reports: SeoReport[]) => void;
  setSelectedSeoReport: (id: string | null) => void;
  
  // Reset state
  reset: () => void;
}

export const ReportGeneratorContext = createContext<ReportGeneratorContextType | undefined>(undefined);

export const ReportGeneratorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // SEO Crawler data
  const [crawlId, setCrawlId] = useState<string | undefined>();
  const [crawlData, setCrawlData] = useState<CrawlResult | undefined>();
  const [useCrawlData, setUseCrawlData] = useState(true);
  
  // PageSpeed data
  const [pageSpeedData, setPageSpeedData] = useState<any>(null);
  const [usePageSpeedData, setUsePageSpeedData] = useState(true);
  
  // URL
  const [url, setUrl] = useState('');
  
  // Business profile
  const [businessUrl, setBusinessUrl] = useState('');
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [useGmbData, setUseGmbData] = useState(true);
  
  // Keywords
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [useKeywordsData, setUseKeywordsData] = useState(true);
  
  // Other settings
  const [customPrompt, setCustomPrompt] = useState(localStorage.getItem('default_seo_prompt') || '');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [seoReports, setSeoReports] = useState<SeoReport[]>([]);
  const [selectedSeoReport, setSelectedSeoReport] = useState<string | null>(null);
  
  const reset = () => {
    setCrawlId(undefined);
    setCrawlData(undefined);
    setUseCrawlData(true);
    setPageSpeedData(null);
    setUsePageSpeedData(true);
    setUrl('');
    setBusinessUrl('');
    setBusinessProfile(null);
    setUseGmbData(true);
    setKeywords([]);
    setUseKeywordsData(true);
    setCustomPrompt(localStorage.getItem('default_seo_prompt') || '');
    setNotes('');
    setFiles([]);
    setSeoReports([]);
    setSelectedSeoReport(null);
  };
  
  const value = {
    crawlId,
    crawlData,
    useCrawlData,
    setCrawlId,
    setCrawlData,
    setUseCrawlData,
    pageSpeedData,
    usePageSpeedData,
    setPageSpeedData,
    setUsePageSpeedData,
    url,
    setUrl,
    businessUrl,
    businessProfile,
    useGmbData,
    setBusinessUrl,
    setBusinessProfile,
    setUseGmbData,
    keywords,
    useKeywordsData,
    setKeywords,
    setUseKeywordsData,
    customPrompt,
    notes,
    files,
    seoReports,
    selectedSeoReport,
    setCustomPrompt,
    setNotes,
    setFiles,
    setSeoReports,
    setSelectedSeoReport,
    reset
  };
  
  return (
    <ReportGeneratorContext.Provider value={value}>
      {children}
    </ReportGeneratorContext.Provider>
  );
};

export const useReportGenerator = () => {
  const context = useContext(ReportGeneratorContext);
  if (context === undefined) {
    throw new Error('useReportGenerator must be used within a ReportGeneratorProvider');
  }
  return context;
};
