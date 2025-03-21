
import React from 'react';
import { Star, Gauge, Globe, MapPin, Phone, Activity, RefreshCw, Calendar, Link2 } from 'lucide-react';
import { BusinessProfile } from '@/types/report.types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ClientPerformanceCardsProps {
  businessProfile: Partial<BusinessProfile> | null;
  pageSpeedScore?: number | null;
  clientWebsite: string;
  onRefreshPageSpeed?: () => void;
  onRefreshBusinessProfile?: () => void;
  isRefreshingPageSpeed?: boolean;
  isRefreshingBusinessProfile?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "bg-green-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
};

const getRatingColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-500";
  if (rating >= 3.5) return "text-amber-500";
  return "text-red-500";
};

export const ClientPerformanceCards: React.FC<ClientPerformanceCardsProps> = ({ 
  businessProfile,
  pageSpeedScore,
  clientWebsite,
  onRefreshPageSpeed,
  onRefreshBusinessProfile,
  isRefreshingPageSpeed = false,
  isRefreshingBusinessProfile = false
}) => {
  const hasBusinessData = Boolean(businessProfile?.businessName);
  const hasPageSpeedData = pageSpeedScore !== undefined && pageSpeedScore !== null;
  const isSimulatedData = businessProfile?.businessName === 'Negocio de ejemplo' || 
                          businessProfile?.businessName?.includes('ejemplo');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Google Business Profile Card */}
      <Card className={cn(
        "transition-all duration-300 hover:shadow-md",
        !hasBusinessData && "opacity-70"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              Perfil de Google Business
            </CardTitle>
            <div className="flex items-center gap-2">
              {hasBusinessData ? (
                isSimulatedData ? (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                    Simulado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Activo
                  </Badge>
                )
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                  No configurado
                </Badge>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={onRefreshBusinessProfile}
                      disabled={isRefreshingBusinessProfile}
                    >
                      <RefreshCw className={cn(
                        "h-4 w-4", 
                        isRefreshingBusinessProfile && "animate-spin"
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Actualizar datos de GMB</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasBusinessData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nombre</span>
                <span className="text-sm">{businessProfile?.businessName}</span>
              </div>
              
              {businessProfile?.businessRating && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Valoración</span>
                    <span className={cn("flex items-center", getRatingColor(businessProfile.businessRating))}>
                      {businessProfile.businessRating.toFixed(1)}
                      <Star className="h-3.5 w-3.5 ml-1 fill-current" />
                      <span className="text-xs text-muted-foreground ml-1">
                        ({businessProfile.businessReviewsCount || 0})
                      </span>
                    </span>
                  </div>
                  <Progress 
                    value={businessProfile.businessRating * 20} 
                    className={cn("h-1.5", getRatingColor(businessProfile.businessRating))}
                  />
                </div>
              )}
              
              {businessProfile?.businessCategory && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Categoría</span>
                  <span className="text-sm">{businessProfile.businessCategory}</span>
                </div>
              )}
              
              {businessProfile?.businessAddress && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" /> 
                    Dirección
                  </span>
                  <span className="text-sm truncate max-w-[200px]">{businessProfile.businessAddress}</span>
                </div>
              )}
              
              {businessProfile?.businessPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-muted-foreground" /> 
                    Teléfono
                  </span>
                  <span className="text-sm">{businessProfile.businessPhone}</span>
                </div>
              )}
              
              {businessProfile?.businessWebsite && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Link2 className="h-3 w-3 mr-1 text-muted-foreground" /> 
                    Web
                  </span>
                  <a 
                    href={businessProfile.businessWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-primary hover:underline truncate max-w-[200px]"
                  >
                    {businessProfile.businessWebsite.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              
              {isSimulatedData && (
                <div className="mt-2 py-2 px-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-xs text-amber-700">
                    Se muestran datos simulados. Realiza un análisis en Tests Rápidos para obtener datos reales.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground">
                No hay datos de Google Business disponibles
              </p>
              {onRefreshBusinessProfile ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3" 
                  onClick={onRefreshBusinessProfile}
                  disabled={isRefreshingBusinessProfile}
                >
                  {isRefreshingBusinessProfile ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Obtener datos GMB
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Actualiza los datos para obtener información
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* PageSpeed Card */}
      <Card className={cn(
        "transition-all duration-300 hover:shadow-md",
        !hasPageSpeedData && "opacity-70"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium flex items-center">
              <Gauge className="h-4 w-4 mr-2 text-primary" />
              Rendimiento Web
            </CardTitle>
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
        </CardHeader>
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
                  className={cn("h-2", 
                    pageSpeedScore >= 90 ? "bg-green-500" :
                    pageSpeedScore >= 50 ? "bg-amber-500" :
                    "bg-red-500"
                  )}
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
              {onRefreshPageSpeed ? (
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
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Actualiza los datos para obtener información
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPerformanceCards;
