import { Report, BusinessProfile, Keyword as ReportKeyword } from '@/types/report.types';
import { SeoReport } from '@/types/seo-reporting.types';

export interface Keyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  customPrompt: string;
  usePageSpeedData: boolean;
  useGmbData: boolean;
  useKeywordsData: boolean;
  keywords: Keyword[];
  notes: string;
  createdAt: string;
}

export interface ReportProgress {
  step: string;
  percentage: number;
  detail: string;
}

export interface ScheduledReport {
  id: string;
  clientId: string;
  url: string;
  templateId: string;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  nextRunDate: string;
  active: boolean;
  createdAt: string;
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
  getReportProgress: (id: string) => Promise<ReportProgress | null>;
  saveReportTemplate: (template: Omit<ReportTemplate, 'id' | 'createdAt'>) => Promise<ReportTemplate>;
  getReportTemplates: () => Promise<ReportTemplate[]>;
  deleteReportTemplate: (id: string) => Promise<void>;
  scheduleReport: (scheduledReport: Omit<ScheduledReport, 'id' | 'createdAt' | 'nextRunDate'>) => Promise<ScheduledReport>;
  getScheduledReports: (clientId?: string) => Promise<ScheduledReport[]>;
  deleteScheduledReport: (id: string) => Promise<void>;
  toggleScheduledReport: (id: string, active: boolean) => Promise<ScheduledReport>;
}
