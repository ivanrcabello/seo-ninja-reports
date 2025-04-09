
import { useEffect } from 'react';
import { useReportsContext } from '@/context/ReportsContext';
import { useLocation } from 'react-router-dom';

// Export a hook that combines context access with route-based refreshing
const useReports = () => {
  const reports = useReportsContext();
  const location = useLocation();
  
  // Refresh reports when location changes
  useEffect(() => {
    reports.refreshReports();
  }, [location.pathname, reports.refreshReports]);
  
  return reports;
};

export default useReports;
