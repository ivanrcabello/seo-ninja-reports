
import { Report, BusinessProfile } from '@/types/report.types';
import { SeoReport } from '@/types/seo-reporting.types';

export interface Keyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
}

export interface ReportsHookReturn {
  reports: Report[];
  isLoading: boolean;
  getReport: (id: string) => Report | undefined;
  getClientReports: (clientId: string) => Report[];
  generateReport: (
    clientId: string, 
    url: string, 
    files: File[], 
    customPrompt?: string,
    pageSpeedData?: any,
    keywords?: Keyword[],
    notes?: string,
    businessProfile?: Partial<BusinessProfile> | null,
    seoReport?: SeoReport | null
  ) => Promise<Report>;
  createReport: (data: Omit<Report, 'id' | 'date' | 'status'>) => Promise<Report>;
  updateReport: (id: string, data: Partial<Report>) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  retryReport: (id: string) => Promise<boolean>;
}
