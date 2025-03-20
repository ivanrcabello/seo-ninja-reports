
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, Loader2 } from 'lucide-react';
import { fetchPageSpeedData } from '@/services/api/pagespeed';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ClientPageSpeedTestProps {
  websiteUrl: string;
  onScoreUpdate?: (score: number) => void;
}

const ClientPageSpeedTest: React.FC<ClientPageSpeedTestProps> = ({ websiteUrl, onScoreUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const handleTest = async () => {
    if (!websiteUrl) {
      toast.error('URL del sitio web no disponible');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await fetchPageSpeedData(websiteUrl);
      
      if (result && result.desktop && result.desktop.performance !== undefined) {
        const desktopScore = Math.round(result.desktop.performance * 100);
        setScore(desktopScore);
        
        if (onScoreUpdate) {
          onScoreUpdate(desktopScore);
        }
        
        toast.success('Análisis completado', {
          description: `Puntuación de rendimiento: ${desktopScore}/100`
        });
      } else {
        toast.error('Error al analizar el sitio', {
          description: 'No se pudo obtener datos de rendimiento'
        });
      }
    } catch (error: any) {
      console.error('Error al analizar PageSpeed:', error);
      toast.error('Error al analizar el sitio', {
        description: error.message || 'No se pudo obtener datos de rendimiento'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <Gauge className="h-5 w-5 mr-2 text-primary" />
          Test de Velocidad Web
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Analiza la velocidad y rendimiento del sitio web utilizando Google PageSpeed
        </p>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleTest} 
            disabled={isLoading || !websiteUrl}
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analizando...
              </span>
            ) : (
              <span className="flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                Analizar Rendimiento
              </span>
            )}
          </Button>
        </div>
        
        {score !== null && (
          <div className="mt-4 pt-4 border-t border-dashed border-border">
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-primary/20">
                <span className={cn(
                  "text-2xl font-bold",
                  score >= 90 ? "text-green-600" :
                  score >= 50 ? "text-amber-600" :
                  "text-red-600"
                )}>
                  {score}
                </span>
              </div>
            </div>
            
            <div className="space-y-1 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Puntuación</span>
                <span className="text-sm">{score}/100</span>
              </div>
              <Progress 
                value={score} 
                className={cn("h-2", getScoreColor(score))}
              />
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              {score >= 90 ? "Excelente rendimiento" :
              score >= 70 ? "Buen rendimiento" :
              score >= 50 ? "Rendimiento medio, necesita mejoras" :
              "Bajo rendimiento, requiere optimización urgente"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientPageSpeedTest;
