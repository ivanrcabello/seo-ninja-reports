
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Report } from '@/types/report.types';
import useAuth from './useAuth';
import { 
  fetchReports, 
  createNewReport, 
  updateExistingReport, 
  deleteReportById,
  generateSeoReport
} from '@/services/reportService';

interface ReportsContextType {
  reports: Report[];
  isLoading: boolean;
  getReport: (id: string) => Report | undefined;
  getClientReports: (clientId: string) => Report[];
  createReport: (data: Omit<Report, 'id' | 'date' | 'status'>) => Promise<Report>;
  updateReport: (id: string, data: Partial<Report>) => Promise<Report>;
  deleteReport: (id: string) => Promise<void>;
  generateReport: (clientId: string, url: string, files: File[], customPrompt?: string, pageSpeedData?: any) => Promise<Report>;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

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
      } catch (error) {
        console.error('Error in loadReports:', error);
        // Error is already handled in fetchReports
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
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

  const generateReport = async (clientId: string, url: string, files: File[], customPrompt?: string, pageSpeedData?: any) => {
    const report = await generateSeoReport(clientId, url, files, customPrompt, pageSpeedData);
    
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

  const value = {
    reports,
    isLoading,
    getReport,
    getClientReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport
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
