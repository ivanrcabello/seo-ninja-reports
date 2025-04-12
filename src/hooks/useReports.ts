
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import {
  fetchReports,
  createNewReport,
  updateExistingReport,
  deleteReportById,
  generateSeoReport,
  retryFailedReport
} from '@/services/reportService';
import { Report, BusinessProfile } from '@/types/report.types';
import { SeoReport } from '@/types/seo-reporting.types';
import { 
  Keyword, 
  ReportProgress, 
  ReportTemplate, 
  ScheduledReport,
  ReportsHookReturn
} from '@/types/report-hooks.types';
import { supabase } from '@/integrations/supabase/client';
import { keywordsToJson } from '@/utils/keywordUtils';

// Create a standalone hook for direct use (not through context)
export default function useReportsHook(): ReportsHookReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Fetch all reports on component mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        toast.error('Error al cargar los informes');
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [location.pathname]);

  // Get a specific report by ID
  const getReport = useCallback((id: string): Report | undefined => {
    return reports.find(report => report.id === id);
  }, [reports]);

  // Get reports for a specific client
  const getClientReports = useCallback((clientId: string): Report[] => {
    return reports.filter(report => report.clientId === clientId);
  }, [reports]);

  // Generate a new report
  const generateReport = useCallback(async (
    clientId: string, 
    url: string, 
    files: File[], 
    customPrompt?: string,
    pageSpeedData?: any,
    keywords?: Keyword[],
    notes?: string,
    businessProfile?: Partial<BusinessProfile> | null,
    seoReport?: SeoReport | null
  ): Promise<Report> => {
    try {
      // Convert keywords to a format that will work with the API
      const processedKeywords = keywords ? keywords.map(k => ({
        keyword: k.keyword,
        searchVolume: typeof k.searchVolume === 'string' ? 
          parseInt(k.searchVolume, 10) || undefined : k.searchVolume,
        difficulty: typeof k.difficulty === 'string' ? 
          parseInt(k.difficulty, 10) || undefined : k.difficulty
      })) : [];

      const report = await generateSeoReport(
        clientId, 
        url, 
        files, 
        customPrompt, 
        pageSpeedData, 
        processedKeywords,
        notes,
        businessProfile,
        seoReport
      );
      
      // Add the new report to our local state
      setReports(prev => [report, ...prev]);
      
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }, []);

  // Create a new report
  const createReport = useCallback(async (data: Omit<Report, 'id' | 'date' | 'status'>): Promise<Report> => {
    try {
      const newReport = await createNewReport(data);
      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }, []);

  // Update an existing report
  const updateReport = useCallback(async (id: string, data: Partial<Report>): Promise<Report> => {
    try {
      // Ensure data has required fields for the Omit type constraint
      if (data && typeof data === 'object') {
        const reportToUpdate = reports.find(r => r.id === id);
        if (reportToUpdate && !data.title) {
          data.title = reportToUpdate.title;
        }
      }
      
      const updatedReport = await updateExistingReport(id, data as any);
      setReports(prev => prev.map(report => 
        report.id === id ? { ...report, ...updatedReport } : report
      ));
      return updatedReport;
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }, [reports]);

  // Delete a report
  const deleteReport = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteReportById(id);
      setReports(prev => prev.filter(report => report.id !== id));
      toast.success('Informe eliminado');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Error al eliminar el informe');
      throw error;
    }
  }, []);

  // Retry a failed report
  const retryReport = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await retryFailedReport(id);
      
      if (result) {
        // Update report status in our local state
        setReports(prev => prev.map(report => 
          report.id === id 
            ? { ...report, status: 'processing' as const, summary: 'Reintentando generación de informe...' } 
            : report
        ));
        
        toast.success('Reintentando generación del informe');
      } else {
        toast.error('No se pudo reintentar el informe');
      }
      
      return result;
    } catch (error) {
      console.error('Error retrying report:', error);
      toast.error('Error al reintentar el informe');
      throw error;
    }
  }, []);

  // Get report progress
  const getReportProgress = useCallback(async (id: string): Promise<ReportProgress | null> => {
    try {
      const report = reports.find(r => r.id === id);
      
      if (!report) {
        return null;
      }
      
      if (report.status === 'completed') {
        return {
          step: 'Informe completado',
          percentage: 100,
          detail: 'El informe se ha generado correctamente'
        };
      }
      
      if (report.status === 'failed') {
        return {
          step: 'Error',
          percentage: 100,
          detail: report.summary || 'Error al generar el informe'
        };
      }
      
      // Simulated progress based on time
      const currentTimestamp = Date.now();
      const reportDate = new Date(report.date).getTime();
      const elapsedSeconds = Math.floor((currentTimestamp - reportDate) / 1000);
      
      // Progreso simulado basado en el tiempo transcurrido (máximo 5 minutos)
      const maxTime = 5 * 60; // 5 minutos en segundos
      const progress = Math.min(Math.floor((elapsedSeconds / maxTime) * 100), 99);
      
      let step = 'Inicializando';
      let detail = 'Preparando la generación del informe...';
      
      if (progress > 10) {
        step = 'Analizando URL';
        detail = 'Extrayendo datos de la URL proporcionada...';
      }
      
      if (progress > 25) {
        step = 'Procesando datos';
        detail = 'Procesando datos de PageSpeed y business profile...';
      }
      
      if (progress > 50) {
        step = 'Generando informe';
        detail = 'OpenAI está generando el contenido del informe...';
      }
      
      if (progress > 75) {
        step = 'Finalizando';
        detail = 'Aplicando formato y finalizando el informe...';
      }
      
      return { step: 'Procesando', percentage: 50, detail: 'Generando informe...' };
    } catch (error) {
      console.error('Error getting report progress:', error);
      return null;
    }
  }, [reports]);

  // Template management functions
  const saveReportTemplate = useCallback(async (template: Omit<ReportTemplate, 'id' | 'createdAt'>): Promise<ReportTemplate> => {
    try {
      // Convert keywords to a JSON-safe format
      const keywordsJson = keywordsToJson(template.keywords || []);
      
      const { data, error } = await supabase
        .from('report_templates')
        .insert({
          name: template.name,
          custom_prompt: template.customPrompt,
          use_page_speed_data: template.usePageSpeedData,
          use_gmb_data: template.useGmbData,
          use_keywords_data: template.useKeywordsData,
          keywords: keywordsJson,
          notes: template.notes
        })
        .select()
        .single();

      if (error) throw error;
      
      // Convert from database format to our app format
      return {
        id: data.id,
        name: data.name,
        customPrompt: data.custom_prompt,
        usePageSpeedData: data.use_page_speed_data,
        useGmbData: data.use_gmb_data,
        useKeywordsData: data.use_keywords_data,
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
        notes: data.notes,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  }, []);

  const getReportTemplates = useCallback(async (): Promise<ReportTemplate[]> => {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert from database format to our app format with proper JSON parsing
      return (data || []).map(item => {
        let parsedKeywords: Keyword[] = [];
        try {
          // Handle both string JSON and already parsed JSON from Supabase
          if (typeof item.keywords === 'string') {
            parsedKeywords = JSON.parse(item.keywords || '[]');
          } else if (Array.isArray(item.keywords)) {
            parsedKeywords = item.keywords;
          }
        } catch (e) {
          console.error('Error parsing keywords:', e);
          parsedKeywords = [];
        }
        
        return {
          id: item.id,
          name: item.name,
          customPrompt: item.custom_prompt,
          usePageSpeedData: item.use_page_speed_data,
          useGmbData: item.use_gmb_data,
          useKeywordsData: item.use_keywords_data,
          keywords: parsedKeywords,
          notes: item.notes,
          createdAt: item.created_at
        };
      });
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }, []);

  const deleteReportTemplate = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('report_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }, []);

  // Scheduled reports functions
  const scheduleReport = useCallback(async (scheduledReport: Omit<ScheduledReport, 'id' | 'createdAt' | 'nextRunDate'>): Promise<ScheduledReport> => {
    try {
      const nextRunDate = new Date();
      let daysToAdd = 7; // Default to 1 week
      
      if (scheduledReport.frequency === 'weekly' && typeof scheduledReport.dayOfWeek === 'number') {
        const currentDay = nextRunDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const targetDay = scheduledReport.dayOfWeek;
        daysToAdd = (targetDay + 7 - currentDay) % 7 || 7;
      } else if (scheduledReport.frequency === 'monthly' && typeof scheduledReport.dayOfMonth === 'number') {
        const currentDate = nextRunDate.getDate();
        const targetDate = scheduledReport.dayOfMonth;
        
        if (targetDate > currentDate) {
          // Target date is later this month
          daysToAdd = targetDate - currentDate;
        } else {
          // Target date is next month
          nextRunDate.setMonth(nextRunDate.getMonth() + 1);
          nextRunDate.setDate(1);
          daysToAdd = targetDate - 1;
        }
      } else if (scheduledReport.frequency === 'quarterly') {
        // Set to first day of next quarter
        const currentMonth = nextRunDate.getMonth();
        const targetMonth = Math.floor(currentMonth / 3) * 3 + 3; // Next quarter start
        
        nextRunDate.setMonth(targetMonth % 12);
        if (targetMonth >= 12) {
          nextRunDate.setFullYear(nextRunDate.getFullYear() + 1);
        }
        
        nextRunDate.setDate(1);
        
        // If day of month specified, add those days
        if (typeof scheduledReport.dayOfMonth === 'number') {
          daysToAdd = scheduledReport.dayOfMonth - 1;
        } else {
          daysToAdd = 0;
        }
      }
      
      nextRunDate.setDate(nextRunDate.getDate() + daysToAdd);
      
      const { data, error } = await supabase
        .from('scheduled_reports')
        .insert({
          client_id: scheduledReport.clientId,
          url: scheduledReport.url,
          template_id: scheduledReport.templateId,
          frequency: scheduledReport.frequency,
          day_of_week: scheduledReport.dayOfWeek,
          day_of_month: scheduledReport.dayOfMonth,
          next_run_date: nextRunDate.toISOString(),
          active: true
        })
        .select()
        .single();

      if (error) throw error;
      
      // Convert from database format to our app format
      return {
        id: data.id,
        clientId: data.client_id,
        url: data.url,
        templateId: data.template_id,
        frequency: data.frequency as 'weekly' | 'monthly' | 'quarterly',
        dayOfWeek: data.day_of_week,
        dayOfMonth: data.day_of_month,
        nextRunDate: data.next_run_date,
        active: data.active,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error scheduling report:', error);
      throw error;
    }
  }, []);

  const getScheduledReports = useCallback(async (clientId?: string): Promise<ScheduledReport[]> => {
    try {
      let query = supabase
        .from('scheduled_reports')
        .select('*')
        .order('next_run_date', { ascending: true });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Convert from database format to our app format
      return (data || []).map(item => ({
        id: item.id,
        clientId: item.client_id,
        url: item.url,
        templateId: item.template_id,
        frequency: item.frequency as 'weekly' | 'monthly' | 'quarterly',
        dayOfWeek: item.day_of_week,
        dayOfMonth: item.day_of_month,
        nextRunDate: item.next_run_date,
        active: item.active,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error getting scheduled reports:', error);
      return [];
    }
  }, []);

  const deleteScheduledReport = useCallback(async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('scheduled_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      throw error;
    }
  }, []);

  const toggleScheduledReport = useCallback(async (id: string, active: boolean): Promise<ScheduledReport> => {
    try {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .update({ active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Convert from database format to our app format
      return {
        id: data.id,
        clientId: data.client_id,
        url: data.url,
        templateId: data.template_id,
        frequency: data.frequency as 'weekly' | 'monthly' | 'quarterly',
        dayOfWeek: data.day_of_week,
        dayOfMonth: data.day_of_month,
        nextRunDate: data.next_run_date,
        active: data.active,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error toggling scheduled report:', error);
      throw error;
    }
  }, []);

  return {
    reports,
    isLoading,
    getReport,
    getClientReports,
    generateReport,
    createReport,
    updateReport,
    deleteReport,
    retryReport,
    getReportProgress,
    saveReportTemplate,
    getReportTemplates,
    deleteReportTemplate,
    scheduleReport,
    getScheduledReports,
    deleteScheduledReport,
    toggleScheduledReport
  };
}
