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
    businessProfile?: Partial<BusinessProfile> | null,
    seoReport?: any
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
        
        // Intentamos verificar informes atascados de manera segura
        try {
          await checkAndFixStuckReports();
        } catch (stuckError) {
          console.error('Error al verificar informes atascados:', stuckError);
          // No interrumpimos el flujo principal si esto falla
        }
      } catch (error) {
        console.error('Error en loadReports:', error);
        toast.error('Error al cargar informes');
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
    
    // Configuramos un intervalo para verificar informes atascados cada 5 minutos
    // pero lo hacemos de manera segura para que no interrumpa la aplicación
    let stuckReportsInterval: NodeJS.Timeout | null = null;
    
    if (user) {
      stuckReportsInterval = setInterval(async () => {
        try {
          await checkAndFixStuckReports();
          // Actualizamos la lista de informes después de arreglar los atascados
          const reportsData = await fetchReports();
          setReports(reportsData);
        } catch (error) {
          console.error('Error al verificar informes atascados en intervalo:', error);
          // No hacemos nada más, simplemente registramos el error
        }
      }, 5 * 60 * 1000); // 5 minutos
    }
    
    return () => {
      if (stuckReportsInterval) {
        clearInterval(stuckReportsInterval);
      }
    };
  }, [user]);

  const getReport = (id: string) => {
    return reports.find(report => report.id === id);
  };

  const getClientReports = (clientId: string) => {
    return reports.filter(report => report.clientId === clientId);
  };

  const createReport = async (data: Omit<Report, 'id' | 'date' | 'status'>) => {
    try {
      const newReport = await createNewReport(data);
      setReports(prevReports => [newReport, ...prevReports]);
      return newReport;
    } catch (error) {
      console.error('Error al crear informe:', error);
      throw error;
    }
  };

  const updateReport = async (id: string, data: Partial<Report>) => {
    try {
      const updatedReport = await updateExistingReport(id, data);
      setReports(prevReports => 
        prevReports.map(report => report.id === id ? updatedReport : report)
      );
      return updatedReport;
    } catch (error) {
      console.error('Error al actualizar informe:', error);
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await deleteReportById(id);
      setReports(prevReports => prevReports.filter(report => report.id !== id));
    } catch (error) {
      console.error('Error al eliminar informe:', error);
      throw error;
    }
  };

  const generateReport = async (
    clientId: string, 
    url: string, 
    files: File[], 
    customPrompt?: string, 
    pageSpeedData?: any,
    keywords?: Keyword[],
    notes?: string,
    businessProfile?: Partial<BusinessProfile> | null,
    seoReport?: any
  ) => {
    try {
      // Pasamos todos los parámetros necesarios
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
      
      // Actualizar el estado según el status del informe
      if (report.status === 'processing') {
        setReports(prevReports => [report, ...prevReports]);
      } else if (report.status === 'completed' || report.status === 'failed') {
        setReports(prevReports => 
          prevReports.map(r => r.id === report.id ? report : r)
        );
      }
      
      return report;
    } catch (error: any) {
      console.error('Error al generar informe:', error);
      toast.error('Error al generar informe: ' + (error.message || 'Error desconocido'));
      throw error;
    }
  };
  
  const retryReport = async (id: string) => {
    try {
      const result = await retryFailedReport(id);
      if (result) {
        // Actualizar el estado del informe en el estado
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
        
        toast.success('Reintentando generación del informe');
      } else {
        toast.error('No se pudo reintentar el informe');
      }
      return result;
    } catch (error) {
      console.error('Error al reintentar informe:', error);
      toast.error('Error al reintentar el informe');
      return false;
    }
  };
  
  const checkForStuckReports = async () => {
    try {
      await checkAndFixStuckReports();
      // Actualizamos la lista de informes
      const reportsData = await fetchReports();
      setReports(reportsData);
    } catch (error) {
      console.error('Error al verificar informes atascados (función manual):', error);
      toast.error('Error al verificar informes atascados');
      throw error;
    }
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
