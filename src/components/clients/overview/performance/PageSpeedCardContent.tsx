
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getScoreColor, getScoreTextColor } from './PerformanceUtils';

interface PageSpeedCardContentProps {
  pageSpeedScore: number | null;
  isRefreshingPageSpeed: boolean;
  onRefreshPageSpeed: () => void;
}

const PageSpeedCardContent: React.FC<PageSpeedCardContentProps> = ({
  pageSpeedScore,
  isRefreshingPageSpeed,
  onRefreshPageSpeed
}) => {
  const hasPageSpeedData = pageSpeedScore !== null;

  if (!hasPageSpeedData) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-muted-foreground">
          No hay datos de rendimiento disponibles
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3" 
          onClick={onRefreshPageSpeed}
          disabled={isRefreshingPageSpeed}
        >
          {isRefreshingPageSpeed ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Analizar rendimiento
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-center my-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-4 border-primary/20">
          <span className={cn(
            "text-xl font-bold",
            getScoreTextColor(pageSpeedScore)
          )}>
            {pageSpeedScore}
          </span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Puntuación</span>
          <span className="text-sm">{pageSpeedScore}/100</span>
        </div>
        <Progress 
          value={pageSpeedScore} 
          className={cn("h-2", getScoreColor(pageSpeedScore))}
        />
      </div>
      
      <div className="pt-2 text-xs text-muted-foreground text-center">
        <p>Puntuación basada en el último análisis disponible</p>
      </div>
    </div>
  );
};

export default PageSpeedCardContent;
