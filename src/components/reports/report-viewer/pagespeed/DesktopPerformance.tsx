
import React from 'react';
import ScoreCard from './ScoreCard';
import MetricItem from './MetricItem';

interface DesktopPerformanceProps {
  data: {
    performance?: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
    firstContentfulPaint?: number;
    speedIndex?: number;
    largestContentfulPaint?: number;
    timeToInteractive?: number;
    totalBlockingTime?: number;
    cumulativeLayoutShift?: number;
  };
}

const DesktopPerformance: React.FC<DesktopPerformanceProps> = ({ data }) => {
  if (!data) {
    return <p className="text-muted-foreground">No hay datos disponibles para desktop.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard title="Rendimiento" value={data.performance} type="performance" />
        <ScoreCard title="Accesibilidad" value={data.accessibility} type="accessibility" />
        <ScoreCard title="Buenas prácticas" value={data.bestPractices} type="bestPractices" />
        <ScoreCard title="SEO" value={data.seo} type="seo" />
      </div>

      {/* Metrics */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Métricas de rendimiento</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MetricItem 
            title="First Contentful Paint" 
            value={data.firstContentfulPaint}
            unit="s"
            description="Tiempo que tarda en mostrarse el primer contenido."
          />
          <MetricItem 
            title="Speed Index" 
            value={data.speedIndex}
            unit="s"
            description="Indicador de la velocidad de carga visual."
          />
          <MetricItem 
            title="Largest Contentful Paint" 
            value={data.largestContentfulPaint}
            unit="s"
            description="Tiempo que tarda en mostrarse el contenido principal."
          />
          <MetricItem 
            title="Time to Interactive" 
            value={data.timeToInteractive}
            unit="s"
            description="Tiempo que tarda en ser completamente interactiva."
          />
          <MetricItem 
            title="Total Blocking Time" 
            value={data.totalBlockingTime}
            unit="ms"
            description="Tiempo total bloqueado en la carga."
          />
          <MetricItem 
            title="Cumulative Layout Shift" 
            value={data.cumulativeLayoutShift}
            description="Estabilidad visual durante la carga."
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopPerformance;
