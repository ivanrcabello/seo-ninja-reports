// Import relevant functions and types
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
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
import React, { createContext, useContext } from 'react';

interface Keyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
}

// Create a standalone hook for direct use (not through context)
export default function useReportsHook() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  return {
    reports,
    isLoading,
    getReport,
    getClientReports,
    generateReport,
    createReport,
    updateReport,
    deleteReport,
    retryReport
  };
}

// Create a context for the ReportsProvider
const ReportsContext = createContext<ReturnType<typeof useReportsHook> | null>(null);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const reportsHook = useReportsHook();
  
  return (
    <ReportsContext.Provider value={reportsHook}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (context === null) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
