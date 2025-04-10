import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { Report, BusinessProfile } from '@/types/report.types';
import { SeoReport } from '@/types/seo-reporting.types';
import { 
  Keyword, 
  ReportProgress, 
  ReportTemplate, 
  ScheduledReport 
} from '@/types/report-hooks.types';
import { supabase } from '@/integrations/supabase/client';

export default function useReportsHook() {
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
      const report = await generateSeoReport(
        clientId, 
        url, 
        files, 
        customPrompt, 
        pageSpeedData, 
        keywords,
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

  // Implementar getReportProgress
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
      
      // Progreso simulado basado en el tiempo
      const currentTimestamp = Date.now();
      const reportDate = new Date(report.date).getTime();
      const elapsedSeconds = Math.floor((currentTimestamp - reportDate) / 1000);
      const maxTime = 5 * 60; // 5 minutos
      const progress = Math.min(Math.floor((elapsedSeconds / maxTime) * 100), 99);
      
      let step = 'Inicializando';
      let detail = 'Preparando la generación del informe...';
      
      if (progress > 10) {
        step = 'Analizando URL';
        detail = 'Extrayendo datos...';
      }
      
      if (progress > 25) {
        step = 'Procesando datos';
        detail = 'Procesando información...';
      }
      
      if (progress > 50) {
        step = 'Generando informe';
        detail = 'OpenAI está generando el contenido...';
      }
      
      if (progress > 75) {
        step = 'Finalizando';
        detail = 'Aplicando formato...';
      }
      
      return { step, percentage: progress, detail };
    } catch (error) {
      console.error('Error getting report progress:', error);
      return null;
    }
  }, [reports]);

  // Template management functions
  const saveReportTemplate = useCallback(async (template: Omit<ReportTemplate, 'id' | 'createdAt'>): Promise<ReportTemplate> => {
    try {
      const { data, error } = await supabase
        .from('report_templates')
        .insert({
          ...template,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      return data || [];
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
      nextRunDate.setDate(nextRunDate.getDate() + 7); // Default to 1 week

      const { data, error } = await supabase
        .from('scheduled_reports')
        .insert({
          ...scheduledReport,
          next_run_date: nextRunDate.toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
      return data || [];
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
      return data;
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
