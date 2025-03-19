
export interface Report {
  id: string;
  title: string;
  summary?: string;
  date: string;
  clientId: string;
  url?: string;
  status: "processing" | "completed" | "failed";
  notes?: string;
  content?: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    localSeo?: string;
    recommendations: string;
    serviceProposal?: string;
    keywords?: string;
    pageSpeedData?: {
      desktop: {
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
      };
      mobile: {
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
      };
    };
  };
  customPrompt?: string;
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
