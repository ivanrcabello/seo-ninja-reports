
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageSpeedResult } from '@/types/report.types';
import { getScoreColorClass, getScoreBackgroundClass } from './utils';
import { Grid } from 'lucide-react';
import MetricItem from './MetricItem';
import { ScoreCard } from './ScoreCard';

interface DeviceScoreCardProps {
  data?: PageSpeedResult;
  title: string;
  subtitle?: string;
  isLoading?: boolean;
}

export const DeviceScoreCard: React.FC<DeviceScoreCardProps> = ({
  data,
  title,
  subtitle,
  isLoading
}) => {
  if (!data && !isLoading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No hay datos de rendimiento disponibles para {title.toLowerCase()}.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate scores
  const performanceScore = data?.performance ? Math.round(data.performance * 100) : 0;
  const accessibilityScore = data?.accessibility ? Math.round(data.accessibility * 100) : 0;
  const bestPracticesScore = data?.bestPractices ? Math.round(data.bestPractices * 100) : 0;
  const seoScore = data?.seo ? Math.round(data.seo * 100) : 0;

  // Format metrics for display
  const metrics = [
    {
      title: 'First Contentful Paint',
      value: data?.firstContentfulPaint ? data.firstContentfulPaint / 1000 : undefined,
      unit: 's',
      description: 'Tiempo hasta que el navegador representa el primer contenido DOM.'
    },
    {
      title: 'Speed Index',
      value: data?.speedIndex ? data.speedIndex / 1000 : undefined,
      unit: 's',
      description: 'Qué tan rápido se llena visualmente el contenido de la página.'
    },
    {
      title: 'Largest Contentful Paint',
      value: data?.largestContentfulPaint ? data.largestContentfulPaint / 1000 : undefined,
      unit: 's',
      description: 'Tiempo para mostrar la imagen o bloque de texto más grande.'
    },
    {
      title: 'Time to Interactive',
      value: data?.timeToInteractive ? data.timeToInteractive / 1000 : undefined,
      unit: 's',
      description: 'Tiempo hasta que la página se vuelve totalmente interactiva.'
    },
    {
      title: 'Total Blocking Time',
      value: data?.totalBlockingTime,
      unit: 'ms',
      description: 'Tiempo total que la página está bloqueada para responder a la entrada.'
    },
    {
      title: 'Cumulative Layout Shift',
      value: data?.cumulativeLayoutShift,
      unit: '',
      description: 'Medida de cuánto cambia inesperadamente el contenido de la página.'
    }
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Grid className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <ScoreCard 
            title="Rendimiento" 
            score={data?.performance || 0} 
            description="Métricas de velocidad de carga" 
          />
          <ScoreCard 
            title="Accesibilidad" 
            score={data?.accessibility || 0} 
            description="Facilidad de uso para todos" 
          />
          <ScoreCard 
            title="Buenas Prácticas" 
            score={data?.bestPractices || 0} 
            description="Seguimiento de estándares web" 
          />
          <ScoreCard 
            title="SEO" 
            score={data?.seo || 0} 
            description="Optimización para buscadores" 
          />
        </div>

        <h3 className="text-base font-medium mt-6 mb-3">Métricas clave de rendimiento</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <MetricItem
              key={index}
              title={metric.title}
              value={metric.value}
              unit={metric.unit}
              description={metric.description}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceScoreCard;
