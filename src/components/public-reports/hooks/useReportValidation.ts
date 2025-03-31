
import { useState, useCallback } from 'react';

/**
 * Small hook to validate report IDs and track not found state
 */
export const useReportValidation = () => {
  const [notFound, setNotFound] = useState(false);
  
  const validateReportId = useCallback((reportId: string): boolean => {
    if (!reportId || reportId.trim() === '') {
      setNotFound(true);
      return false;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValid = uuidRegex.test(reportId);
    
    if (!isValid) {
      setNotFound(true);
    }
    
    return isValid;
  }, []);
  
  return {
    validateReportId,
    notFound,
    setNotFound
  };
};
