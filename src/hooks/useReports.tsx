
import { useReportsContext } from '@/context/ReportsContext';

// Export a hook that combines context access and additional functionality if needed
const useReports = () => {
  const reportsContext = useReportsContext();
  
  if (!reportsContext) {
    console.error('useReports must be used within a ReportsProvider');
    // Return a safe fallback to prevent app crashes
    return {
      reports: [],
      getReport: () => null,
      isLoading: false,
      error: 'ReportsContext not available',
      createReport: async () => null,
      updateReport: async () => false,
      deleteReport: async () => false,
      refreshReports: async () => false,
    };
  }
  
  return reportsContext;
};

export default useReports;
