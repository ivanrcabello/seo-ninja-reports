
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gauge, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ClientPageSpeedCardProps {
  pageSpeedScore: number | null;
  isRefreshingPageSpeed: boolean;
  onRefreshPageSpeed: () => void;
}

const ClientPageSpeedCard: React.FC<ClientPageSpeedCardProps> = ({
  pageSpeedScore,
  isRefreshingPageSpeed,
  onRefreshPageSpeed
}) => {
  const hasPageSpeedData = pageSpeedScore !== null;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      !hasPageSpeedData && "opacity-70"
    )}>
      <div className="pb-2 px-6 pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium flex items-center">
            <Gauge className="h-4 w-4 mr-2 text-primary" />
            Rendimiento Web
          </h3>
          <div className="flex items-center gap-2">
            {hasPageSpeedData ? (
              <Badge 
                variant="outline" 
                className={cn(
                  "border",
                  pageSpeedScore >= 90 ? "bg-green-100 text-green-800 border-green-200" :
                  pageSpeedScore >= 50 ? "bg-amber-100 text-amber-800 border-amber-200" :
                  "bg-red-100 text-red-800 border-red-200"
                )}
              >
                {pageSpeedScore >= 90 ? "Rápido" : 
                 pageSpeedScore >= 50 ? "Medio" : "Lento"}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                No analizado
              </Badge>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={onRefreshPageSpeed}
                    disabled={isRefreshingPageSpeed}
                  >
                    <RefreshCw className={cn(
                      "h-4 w-4", 
                      isRefreshingPageSpeed && "animate-spin"
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualizar datos de rendimiento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <CardContent>
        {hasPageSpeedData ? (
          <div className="space-y-3">
            <div className="text-center my-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-4 border-primary/20">
                <span className={cn(
                  "text-xl font-bold",
                  pageSpeedScore >= 90 ? "text-green-600" :
                  pageSpeedScore >= 50 ? "text-amber-600" :
                  "text-red-600"
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
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default ClientPageSpeedCard;
