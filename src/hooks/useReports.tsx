
import { useReportsContext } from '@/context/ReportsContext';

// Export a hook that combines context access
const useReports = () => {
  const reports = useReportsContext();
  
  return reports;
};

export default useReports;
