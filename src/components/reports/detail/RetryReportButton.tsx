
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import useReports from '@/hooks/useReports';
import { toast } from 'sonner';

interface RetryReportButtonProps {
  reportId: string;
  status: 'processing' | 'completed' | 'failed';
}

const RetryReportButton: React.FC<RetryReportButtonProps> = ({ reportId, status }) => {
  const { retryReport } = useReports();
  const [isRetrying, setIsRetrying] = React.useState(false);
  
  // Only show the retry button for failed reports
  if (status !== 'failed') {
    return null;
  }
  
  const handleRetry = async () => {
    try {
      setIsRetrying(true);
      const success = await retryReport(reportId);
      
      if (success) {
        toast.success('Reintentando generación del informe');
      } else {
        toast.error('No se pudo reintentar la generación del informe');
      }
    } catch (error) {
      console.error('Error retrying report:', error);
      toast.error('Error al reintentar la generación del informe');
    } finally {
      setIsRetrying(false);
    }
  };
  
  return (
    <Button 
      onClick={handleRetry} 
      disabled={isRetrying}
      variant="destructive"
      size="sm"
      className="flex items-center gap-1"
    >
      {isRetrying ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {isRetrying ? 'Reintentando...' : 'Reintentar informe'}
    </Button>
  );
};

export default RetryReportButton;
