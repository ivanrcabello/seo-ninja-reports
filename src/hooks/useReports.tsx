
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Report, BusinessProfile } from '@/types/report.types';
import useAuth from './useAuth';
import { 
  fetchReports, 
  createNewReport, 
  updateExistingReport, 
  deleteReportById,
  generateSeoReport,
  retryFailedReport,
  checkAndFixStuckReports,
  saveBusinessProfile
} from '@/services/reportService';
import { toast } from 'sonner';

interface Keyword {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
}

interface ReportsContextType {
  reports: Report[];
  isLoading: boolean;
  getReport: (id: string) => Report | undefined;
  getClientReports: (clientId: string) => Report[];
  createReport: (data: Omit<Report, 'id' | 'date' | 'status'>) => Promise<Report>;
  updateReport: (id: string, data: Partial<Report>) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (
    clientId: string, 
    url: string, 
    files: File[], 
    customPrompt?: string, 
    pageSpeedData?: any,
    keywords?: Keyword[],
    notes?: string,
    businessProfile?: Partial<BusinessProfile> | null
  ) => Promise<Report>;
  retryReport: (id: string) => Promise<boolean>;
  checkForStuckReports: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Export ReportsProvider as a named export
export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadReports = async () => {
      if (!user) {
        setReports([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const reportsData = await fetchReports();
        setReports(reportsData);
        
        // Check for stuck reports on initial load
        await checkAndFixStuckReports();
      } catch (error) {
        console.error('Error in loadReports:', error);
        // Error is already handled in fetchReports
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
    
    // Set up interval to check for stuck reports every 5 minutes
    const stuckReportsInterval = setInterval(async () => {
      if (user) {
        try {
          await checkAndFixStuckReports();
          // Refresh reports list after fixing stuck reports
          const reportsData = await fetchReports();
          setReports(reportsData);
        } catch (error) {
          console.error('Error checking for stuck reports:', error);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      clearInterval(stuckReportsInterval);
    };
  }, [user]);

  const getReport = (id: string) => {
    return reports.find(report => report.id === id);
  };

  const getClientReports = (clientId: string) => {
    return reports.filter(report => report.clientId === clientId);
  };

  const createReport = async (data: Omit<Report, 'id' | 'date' | 'status'>) => {
    const newReport = await createNewReport(data);
    setReports(prevReports => [newReport, ...prevReports]);
    return newReport;
  };

  const updateReport = async (id: string, data: Partial<Report>) => {
    const updatedReport = await updateExistingReport(id, data);
    setReports(prevReports => 
      prevReports.map(report => report.id === id ? updatedReport : report)
    );
    return updatedReport;
  };

  const deleteReport = async (id: string) => {
    await deleteReportById(id);
    setReports(prevReports => prevReports.filter(report => report.id !== id));
  };

  const generateReport = async (
    clientId: string, 
    url: string, 
    files: File[], 
    customPrompt?: string, 
    pageSpeedData?: any,
    keywords?: Keyword[],
    notes?: string,
    businessProfile?: Partial<BusinessProfile> | null
  ) => {
    const report = await generateSeoReport(
      clientId, 
      url, 
      files, 
      customPrompt, 
      pageSpeedData,
      keywords,
      notes
    );
    
    // Si tenemos información de perfil de negocio, la guardamos después
    // de que se haya creado el informe
    if (businessProfile && report.id) {
      try {
        await saveBusinessProfile(report.id, {
          businessUrl: businessProfile.businessUrl || '',
          businessName: businessProfile.businessName,
          businessAddress: businessProfile.businessAddress,
          businessPhone: businessProfile.businessPhone,
          businessCategory: businessProfile.businessCategory,
          businessRating: businessProfile.businessRating,
          businessReviewsCount: businessProfile.businessReviewsCount,
          businessWebsite: businessProfile.businessWebsite,
          businessHours: businessProfile.businessHours
        });
        
        // Actualizar el reporte en el estado para incluir hasBusinessProfile
        report.hasBusinessProfile = true;
      } catch (error) {
        console.error('Error al guardar perfil de negocio:', error);
        // No detenemos la generación del informe si falla el guardado del perfil
      }
    }
    
    // Update reports state based on status
    if (report.status === 'processing') {
      setReports(prevReports => [report, ...prevReports]);
    } else if (report.status === 'completed' || report.status === 'failed') {
      setReports(prevReports => 
        prevReports.map(r => r.id === report.id ? report : r)
      );
    }
    
    return report;
  };
  
  const retryReport = async (id: string) => {
    const result = await retryFailedReport(id);
    if (result) {
      // Update the report status in the state
      const report = getReport(id);
      if (report) {
        const updatedReport = {
          ...report,
          status: 'processing' as const,
          summary: 'Reintentando generación de informe...'
        };
        
        setReports(prevReports => 
          prevReports.map(r => r.id === id ? updatedReport : r)
        );
      }
    }
    return result;
  };
  
  const checkForStuckReports = async () => {
    await checkAndFixStuckReports();
    // Refresh reports list
    const reportsData = await fetchReports();
    setReports(reportsData);
  };

  const value = {
    reports,
    isLoading,
    getReport,
    getClientReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    retryReport,
    checkForStuckReports
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};

const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export default useReports;
