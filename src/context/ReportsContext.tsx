
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Report, BusinessProfile } from '@/types/report.types';
import { SeoReport } from '@/types/seo-reporting.types';
import { 
  fetchReports, 
  createNewReport, 
  updateExistingReport, 
  deleteReportById, 
  generateSeoReport, 
  retryFailedReport 
} from '@/services/reportService';
import { ReportProgress, ReportTemplate, ScheduledReport } from '@/types/report-hooks.types';

interface Keyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
}

interface ReportsContextType {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
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

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a dedicated function for fetching reports that can be called to refresh data
  const refreshReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchReports();
      setReports(data);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      setError(error.message || 'Error al cargar los informes');
      toast.error('Error al cargar los informes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all reports on component mount
  useEffect(() => {
    refreshReports();
  }, []);

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
    } catch (error: any) {
      console.error('Error generating report:', error);
      setError(error.message || 'Error al generar informe');
      throw error;
    }
  }, []);

  // Create a new report
  const createReport = useCallback(async (data: Omit<Report, 'id' | 'date' | 'status'>): Promise<Report> => {
    try {
      const newReport = await createNewReport(data);
      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (error: any) {
      console.error('Error creating report:', error);
      setError(error.message || 'Error al crear informe');
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
    } catch (error: any) {
      console.error('Error updating report:', error);
      setError(error.message || 'Error al actualizar informe');
      throw error;
    }
  }, [reports]);

  // Delete a report
  const deleteReport = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteReportById(id);
      setReports(prev => prev.filter(report => report.id !== id));
      toast.success('Informe eliminado');
    } catch (error: any) {
      console.error('Error deleting report:', error);
      setError(error.message || 'Error al eliminar informe');
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
    } catch (error: any) {
      console.error('Error retrying report:', error);
      setError(error.message || 'Error al reintentar informe');
      toast.error('Error al reintentar el informe');
      throw error;
    }
  }, []);
  
  // NUEVAS FUNCIONES
  
  // Get report progress
  const getReportProgress = useCallback(async (id: string): Promise<ReportProgress | null> => {
    try {
      // Simulación de progreso - en producción, esto consultaría a la API
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
      
      // Simulación - en producción, esto consultaría el progreso real
      // En una implementación real, esto obtendría datos de la API
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
      
      return {
        step,
        percentage: progress,
        detail
      };
    } catch (error: any) {
      console.error('Error getting report progress:', error);
      return null;
    }
  }, [reports]);
  
  // Save a report template
  const saveReportTemplate = useCallback(async (template: Omit<ReportTemplate, 'id' | 'createdAt'>): Promise<ReportTemplate> => {
    try {
      // Simulación - en producción, esto guardaría el template en la base de datos
      const newTemplate: ReportTemplate = {
        ...template,
        id: `template_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      // En una implementación real, esto guardaría en Supabase
      // Guardar en localStorage para la demo
      const existingTemplates = JSON.parse(localStorage.getItem('report_templates') || '[]');
      const updatedTemplates = [...existingTemplates, newTemplate];
      localStorage.setItem('report_templates', JSON.stringify(updatedTemplates));
      
      return newTemplate;
    } catch (error: any) {
      console.error('Error saving template:', error);
      setError(error.message || 'Error al guardar plantilla');
      throw error;
    }
  }, []);
  
  // Get report templates
  const getReportTemplates = useCallback(async (): Promise<ReportTemplate[]> => {
    try {
      // Simulación - en producción, esto obtendría los templates de la base de datos
      const templates = JSON.parse(localStorage.getItem('report_templates') || '[]');
      return templates;
    } catch (error: any) {
      console.error('Error getting templates:', error);
      setError(error.message || 'Error al obtener plantillas');
      return [];
    }
  }, []);
  
  // Delete a report template
  const deleteReportTemplate = useCallback(async (id: string): Promise<void> => {
    try {
      // Simulación - en producción, esto eliminaría el template de la base de datos
      const existingTemplates = JSON.parse(localStorage.getItem('report_templates') || '[]');
      const updatedTemplates = existingTemplates.filter((t: ReportTemplate) => t.id !== id);
      localStorage.setItem('report_templates', JSON.stringify(updatedTemplates));
    } catch (error: any) {
      console.error('Error deleting template:', error);
      setError(error.message || 'Error al eliminar plantilla');
      throw error;
    }
  }, []);
  
  // Schedule a report
  const scheduleReport = useCallback(async (scheduledReport: Omit<ScheduledReport, 'id' | 'createdAt' | 'nextRunDate'>): Promise<ScheduledReport> => {
    try {
      // Calcular nextRunDate basado en la frecuencia
      const now = new Date();
      let nextRunDate = new Date();
      
      if (scheduledReport.frequency === 'weekly') {
        // Establecer al próximo día de la semana
        const dayOfWeek = scheduledReport.dayOfWeek || 1; // Lunes por defecto
        const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
        const daysToAdd = (dayOfWeek + 7 - currentDay) % 7 || 7;
        nextRunDate.setDate(now.getDate() + daysToAdd);
      } else if (scheduledReport.frequency === 'monthly') {
        // Establecer al día del mes especificado
        const dayOfMonth = scheduledReport.dayOfMonth || 1;
        nextRunDate = new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth);
      } else if (scheduledReport.frequency === 'quarterly') {
        // Establecer al próximo trimestre
        const dayOfMonth = scheduledReport.dayOfMonth || 1;
        const monthsToAdd = 3 - (now.getMonth() % 3) + (now.getDate() >= dayOfMonth ? 0 : -1);
        nextRunDate = new Date(now.getFullYear(), now.getMonth() + monthsToAdd, dayOfMonth);
      }
      
      // Crear el registro de informe programado
      const newScheduledReport: ScheduledReport = {
        ...scheduledReport,
        id: `scheduled_${Date.now()}`,
        nextRunDate: nextRunDate.toISOString(),
        createdAt: now.toISOString()
      };
      
      // En una implementación real, esto guardaría en Supabase
      // Guardar en localStorage para la demo
      const existingScheduled = JSON.parse(localStorage.getItem('scheduled_reports') || '[]');
      const updatedScheduled = [...existingScheduled, newScheduledReport];
      localStorage.setItem('scheduled_reports', JSON.stringify(updatedScheduled));
      
      return newScheduledReport;
    } catch (error: any) {
      console.error('Error scheduling report:', error);
      setError(error.message || 'Error al programar informe');
      throw error;
    }
  }, []);
  
  // Get scheduled reports
  const getScheduledReports = useCallback(async (clientId?: string): Promise<ScheduledReport[]> => {
    try {
      // Simulación - en producción, esto obtendría los informes programados de la base de datos
      const scheduled = JSON.parse(localStorage.getItem('scheduled_reports') || '[]');
      
      if (clientId) {
        return scheduled.filter((s: ScheduledReport) => s.clientId === clientId);
      }
      
      return scheduled;
    } catch (error: any) {
      console.error('Error getting scheduled reports:', error);
      setError(error.message || 'Error al obtener informes programados');
      return [];
    }
  }, []);
  
  // Delete a scheduled report
  const deleteScheduledReport = useCallback(async (id: string): Promise<void> => {
    try {
      // Simulación - en producción, esto eliminaría el informe programado de la base de datos
      const existingScheduled = JSON.parse(localStorage.getItem('scheduled_reports') || '[]');
      const updatedScheduled = existingScheduled.filter((s: ScheduledReport) => s.id !== id);
      localStorage.setItem('scheduled_reports', JSON.stringify(updatedScheduled));
    } catch (error: any) {
      console.error('Error deleting scheduled report:', error);
      setError(error.message || 'Error al eliminar informe programado');
      throw error;
    }
  }, []);
  
  // Toggle a scheduled report
  const toggleScheduledReport = useCallback(async (id: string, active: boolean): Promise<ScheduledReport> => {
    try {
      // Simulación - en producción, esto actualizaría el informe programado en la base de datos
      const existingScheduled = JSON.parse(localStorage.getItem('scheduled_reports') || '[]');
      const updatedScheduled = existingScheduled.map((s: ScheduledReport) => 
        s.id === id ? { ...s, active } : s
      );
      localStorage.setItem('scheduled_reports', JSON.stringify(updatedScheduled));
      
      return updatedScheduled.find((s: ScheduledReport) => s.id === id);
    } catch (error: any) {
      console.error('Error toggling scheduled report:', error);
      setError(error.message || 'Error al cambiar estado de informe programado');
      throw error;
    }
  }, []);

  const value = {
    reports,
    isLoading,
    error,
    refreshReports,
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

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsContext = (): ReportsContextType => {
  const context = useContext(ReportsContext);
  
  if (context === undefined) {
    throw new Error('useReportsContext must be used within a ReportsProvider');
  }
  
  return context;
};
