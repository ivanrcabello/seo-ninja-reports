
export interface SeoReport {
  id: string;
  clientId: string;
  domain: string;
  traffic?: number;
  keywords?: number;
  backlinks?: number;
  createdAt: string;
  updatedAt: string;
  keywordsData?: SeoKeyword[];
  competitorsData?: SeoCompetitor[];
  organicTrafficData?: { date: string; value: number }[];
  rankingDistribution?: { range: string; count: number }[];
  keywordIntentions?: { intention: string; count: number; traffic: number; percentage: number }[];
  backlinkTypes?: { type: string; count: number }[];
  followNofollow?: { type: string; count: number; percentage: number }[];
}

export interface SeoKeyword {
  id: string;
  reportId: string;
  keyword: string;
  position?: number;
  volume?: number;
  trafficPercent?: number;
  createdAt: string;
}

export interface SeoCompetitor {
  id: string;
  reportId: string;
  domain: string;
  keywordsOverlap?: number;
  competitionLevel?: number;
  createdAt: string;
}
