
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gauge, RefreshCw, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { fetchPageSpeedData } from '@/services/api/pagespeed';
import { getPageSpeedData } from '@/services/api/pagespeed/getPageSpeedData';
import { supabase } from '@/integrations/supabase/client';

interface ClientPageSpeedTabProps {
  clientWebsite: string;
  pageSpeedScore: number | null | undefined;
  isRefreshingPageSpeed: boolean;
  onRefreshPageSpeed: () => void;
  onPageSpeedUpdate: (score: number) => void;
}

const ClientPageSpeedTab: React.FC<ClientPageSpeedTabProps> = ({
  clientWebsite,
  pageSpeedScore,
  isRefreshingPageSpeed,
  onRefreshPageSpeed,
  onPageSpeedUpdate
}) => {
  const [fullPageSpeedData, setFullPageSpeedData] = useState<any>(null);
  const [latestReportId, setLatestReportId] = useState<string | null>(null);
  
  const getScoreColor = (score: number | undefined | null) => {
    if (!score) return "bg-gray-200";
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getScoreTextColor = (score: number | undefined | null) => {
    if (!score) return "text-gray-500";
    if (score >= 90) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };
  
  // Fetch the latest report ID for this client
  useEffect(() => {
    const fetchLatestReportId = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Error fetching latest report:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setLatestReportId(data[0].id);
          
          // Now fetch PageSpeed data for this report
          if (data[0].id) {
            const pageSpeedData = await getPageSpeedData(data[0].id);
            if (pageSpeedData) {
              setFullPageSpeedData(pageSpeedData);
              console.log("Loaded PageSpeed data:", pageSpeedData);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchLatestReportId:', error);
      }
    };
    
    fetchLatestReportId();
  }, []);
  
  const handleRefreshPageSpeed = async () => {
    if (!clientWebsite) {
      toast.error('No hay sitio web configurado para este cliente');
      return;
    }
    
    try {
      toast.info('Analizando rendimiento del sitio web', {
        description: 'Esto puede tardar unos momentos...'
      });
      
      const result = await fetchPageSpeedData(clientWebsite);
      
      if (result) {
        setFullPageSpeedData(result);
        
        if (result.desktop && typeof result.desktop.performance !== 'undefined') {
          const desktopScore = Math.round(result.desktop.performance * 100);
          onPageSpeedUpdate(desktopScore);
          toast.success('Datos de rendimiento actualizados');
        }
      } else {
        toast.error('No se pudieron obtener datos de rendimiento');
      }
    } catch (error) {
      console.error('Error refreshing PageSpeed data:', error);
      toast.error('Error al obtener datos de rendimiento');
    }
  };
  
  const formatTimeMetric = (timeInMs: number | undefined): string => {
    if (timeInMs === undefined) return 'N/A';
    if (timeInMs >= 1000) {
      return `${(timeInMs / 1000).toFixed(1)} s`;
    }
    return `${Math.round(timeInMs)} ms`;
  };

  const hasPageSpeedData = pageSpeedScore !== null && pageSpeedScore !== undefined;
  const hasFullData = fullPageSpeedData !== null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center">
            <Gauge className="h-5 w-5 mr-2 text-primary" />
            Análisis de Rendimiento Web
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasPageSpeedData ? (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                No hay datos de rendimiento disponibles
              </p>
              <Button 
                variant="outline" 
                onClick={onRefreshPageSpeed}
                disabled={isRefreshingPageSpeed || !clientWebsite}
                className="mx-auto"
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
          ) : (
            <>
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-primary/20">
                    <span className={cn(
                      "text-2xl font-bold",
                      getScoreTextColor(pageSpeedScore)
                    )}>
                      {pageSpeedScore}
                    </span>
                  </div>
                  <h3 className="text-md font-medium mt-2">Puntuación de rendimiento</h3>
                </div>
                
                <div className="space-y-1 my-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rendimiento</span>
                    <span className="text-sm">{pageSpeedScore}/100</span>
                  </div>
                  <Progress 
                    value={pageSpeedScore} 
                    className={cn("h-2", getScoreColor(pageSpeedScore))}
                  />
                </div>
                
                {clientWebsite && (
                  <div className="p-3 border rounded-md bg-muted/30 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-muted-foreground mr-2">URL:</span>
                          <a 
                            href={clientWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-primary truncate hover:underline flex items-center"
                          >
                            {clientWebsite}
                            <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {hasFullData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Desktop Metrics */}
                    {fullPageSpeedData.desktop && (
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center mb-3">
                          <Monitor className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="font-medium">Escritorio</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Core Web Vitals */}
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">Core Web Vitals</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <div className="text-xs text-muted-foreground">LCP</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.desktop.largestContentfulPaint)}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">CLS</div>
                              <div className="text-xs font-medium">
                                {fullPageSpeedData.desktop.cumulativeLayoutShift || 'N/A'}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">FID / TBT</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.desktop.totalBlockingTime)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Additional Metrics */}
                          <div className="space-y-1 pt-2 border-t border-border">
                            <h4 className="text-sm font-medium">Métricas adicionales</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <div className="text-xs text-muted-foreground">FCP</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.desktop.firstContentfulPaint)}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">Speed Index</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.desktop.speedIndex)}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">TTI</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.desktop.timeToInteractive)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Audits */}
                          <div className="space-y-1 pt-2 border-t border-border">
                            <h4 className="text-sm font-medium">Auditorías</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <div className="text-xs text-muted-foreground">Accesibilidad</div>
                              <div className="text-xs font-medium">
                                {fullPageSpeedData.desktop.accessibility !== undefined 
                                  ? `${Math.round(fullPageSpeedData.desktop.accessibility * 100)}/100` 
                                  : 'N/A'}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">Mejores prácticas</div>
                              <div className="text-xs font-medium">
                                {fullPageSpeedData.desktop.bestPractices !== undefined 
                                  ? `${Math.round(fullPageSpeedData.desktop.bestPractices * 100)}/100` 
                                  : 'N/A'}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">SEO</div>
                              <div className="text-xs font-medium">
                                {fullPageSpeedData.desktop.seo !== undefined 
                                  ? `${Math.round(fullPageSpeedData.desktop.seo * 100)}/100` 
                                  : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Mobile Metrics */}
                    {fullPageSpeedData.mobile && (
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center mb-3">
                          <Smartphone className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="font-medium">Móvil</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Core Web Vitals */}
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">Core Web Vitals</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <div className="text-xs text-muted-foreground">LCP</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.mobile.largestContentfulPaint)}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">CLS</div>
                              <div className="text-xs font-medium">
                                {fullPageSpeedData.mobile.cumulativeLayoutShift || 'N/A'}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">FID / TBT</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.mobile.totalBlockingTime)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Additional Metrics */}
                          <div className="space-y-1 pt-2 border-t border-border">
                            <h4 className="text-sm font-medium">Métricas adicionales</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <div className="text-xs text-muted-foreground">FCP</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.mobile.firstContentfulPaint)}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">Speed Index</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.mobile.speedIndex)}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">TTI</div>
                              <div className="text-xs font-medium">
                                {formatTimeMetric(fullPageSpeedData.mobile.timeToInteractive)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Audits */}
                          <div className="space-y-1 pt-2 border-t border-border">
                            <h4 className="text-sm font-medium">Auditorías</h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <div className="text-xs text-muted-foreground">Accesibilidad</div>
                              <div className="text-xs font-medium">
                                {fullPageSpeedData.mobile.accessibility !== undefined 
                                  ? `${Math.round(fullPageSpeedData.mobile.accessibility * 100)}/100` 
                                  : 'N/A'}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">Mejores prácticas</div>
                              <div className="text-xs font-medium">
                                {fullPageSpeedData.mobile.bestPractices !== undefined 
                                  ? `${Math.round(fullPageSpeedData.mobile.bestPractices * 100)}/100` 
                                  : 'N/A'}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">SEO</div>
                              <div className="text-xs font-medium">
                                {fullPageSpeedData.mobile.seo !== undefined 
                                  ? `${Math.round(fullPageSpeedData.mobile.seo * 100)}/100` 
                                  : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleRefreshPageSpeed}
                  disabled={isRefreshingPageSpeed || !clientWebsite}
                  className="w-full"
                >
                  {isRefreshingPageSpeed ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Actualizar análisis
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPageSpeedTab;
