
import { useState, useCallback } from 'react';

export function useReportValidation() {
  const [notFound, setNotFound] = useState(false);

  const validateReportId = useCallback((reportId: string): boolean => {
    if (!reportId || reportId.trim() === '') {
      console.error('No reportId provided');
      setNotFound(true);
      return false;
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(reportId)) {
      console.error('Invalid UUID format:', reportId);
      setNotFound(true);
      return false;
    }

    return true;
  }, []);

  return { 
    validateReportId, 
    notFound, 
    setNotFound 
  };
}
