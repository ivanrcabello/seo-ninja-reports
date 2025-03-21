
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
