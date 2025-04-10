
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ReportProgress } from '@/types/report-hooks.types';
import useReports from '@/hooks/useReports';
import { Loader2 } from 'lucide-react';

interface ReportProgressIndicatorProps {
  reportId: string;
  onComplete?: () => void;
}

const ReportProgressIndicator: React.FC<ReportProgressIndicatorProps> = ({ 
  reportId, 
  onComplete 
}) => {
  const [progress, setProgress] = useState<ReportProgress | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const { getReportProgress } = useReports();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    const pollProgress = async () => {
      try {
        const currentProgress = await getReportProgress(reportId);
        setProgress(currentProgress);
        
        // If progress is 100% or report is complete, stop polling
        if (currentProgress && currentProgress.percentage >= 100) {
          setIsPolling(false);
          if (onComplete) {
            onComplete();
          }
        }
      } catch (error) {
        console.error('Error fetching report progress:', error);
      }
    };
    
    if (isPolling) {
      // Initial poll
      pollProgress();
      
      // Set up interval for polling (every 2 seconds)
      intervalId = setInterval(pollProgress, 2000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [reportId, isPolling, getReportProgress, onComplete]);

  if (!progress) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 text-primary animate-spin mr-2" />
        <span>Iniciando proceso...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 py-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{progress.step}</span>
        <span className="text-sm text-muted-foreground">{progress.percentage}%</span>
      </div>
      <Progress 
        value={progress.percentage} 
        className="h-2 w-full" 
        // Fixed color classes
        indicatorClassName={progress.percentage >= 100 ? "bg-green-500" : "bg-primary"}
      />
      <p className="text-xs text-muted-foreground">{progress.detail}</p>
    </div>
  );
};

export default ReportProgressIndicator;
