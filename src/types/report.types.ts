
export interface Report {
  id: string;
  title: string;
  summary?: string;
  date: string;
  clientId: string;
  url?: string;
  status: "processing" | "completed" | "failed";
  content?: {
    executiveSummary: string;
    technicalAnalysis: string;
    contentAnalysis: string;
    backlinksAnalysis: string;
    localSeo?: string;
    recommendations: string;
    serviceProposal?: string;
  };
  customPrompt?: string;
  pageSpeedData?: {
    desktop: PageSpeedResult;
    mobile: PageSpeedResult;
  };
}

export interface PageSpeedResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  firstContentfulPaint?: number;
  speedIndex?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
}
