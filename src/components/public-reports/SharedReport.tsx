
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSharedReportData } from './hooks/useSharedReportData';
import PublicReportContent from './PublicReportContent';
import PublicReportLoading from './PublicReportLoading';
import PublicReportEmpty from './PublicReportEmpty';
import PublicReportError from './PublicReportError';

const SharedReport: React.FC = () => {
  const { reportId } = useParams();
  const [retryCount, setRetryCount] = useState(0);
  
  const { report, loading, error } = useSharedReportData(reportId || '');

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      window.location.reload();
    }
  };

  if (loading) {
    return <PublicReportLoading onRetry={handleRetry} />;
  }

  if (error) {
    return (
      <PublicReportError 
        errorMessage={error.message}
        onRetry={handleRetry}
        onHome={() => window.location.href = '/'}
        retryCount={retryCount}
      />
    );
  }

  if (!report) {
    return (
      <PublicReportEmpty 
        onRetry={handleRetry}
        onBack={() => window.location.href = '/'}
      />
    );
  }

  return <PublicReportContent report={report} />;
};

export default SharedReport;
