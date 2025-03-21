
export interface Report {
  id: string;
  title: string;
  summary?: string;
  date: string;
  clientId: string;
  url?: string;
  status: "processing" | "completed" | "failed";
  notes?: string;
  hasBusinessProfile?: boolean;
  content?: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    localSeo?: string;
    recommendations: string;
    serviceProposal?: string;
    keywords?: string;
    keywordsAnalysis?: string;
    onPageSEO?: string;
    technicalSEO?: string;
    localSEO?: string;
    contentStrategy?: string;
    pageSpeedData?: PageSpeedData;
    businessProfile?: BusinessProfile;
  };
  customPrompt?: string;
  customSections?: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface PageSpeedData {
  desktop: PageSpeedResult;
  mobile: PageSpeedResult;
}

export interface PageSpeedResult {
  performance?: number;
  accessibility?: number;
  bestPractices?: number;
  seo?: number;
  firstContentfulPaint?: number;
  speedIndex?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
}

export interface Keyword {
  id: string;
  reportId: string;
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  createdAt: string;
}

export interface BusinessProfile {
  id?: string;
  reportId?: string;
  businessUrl: string;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessCategory?: string;
  businessRating?: number;
  businessReviewsCount?: number;
  businessWebsite?: string;
  businessHours?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}
