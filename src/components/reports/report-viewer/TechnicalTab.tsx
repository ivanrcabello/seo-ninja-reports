
import React from 'react';
import ReportSection from '../report-section/ReportSection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TechnicalTabProps {
  content: string;
  isEditing?: boolean;
  onSave?: (content: string) => Promise<void>;
}

const TechnicalTab: React.FC<TechnicalTabProps> = ({ 
  content, 
  isEditing = false,
  onSave 
}) => {
  // Enhanced extraction for technical metrics with multiple patterns
  const extractMetrics = (text: string) => {
    const metrics: Record<string, number> = {};
    
    // Common patterns for scores in the text - expanded to catch more variations
    const patterns = [
      /(\w+(?:\s+\w+)*):\s*(\d+)\/100/gi,
      /(\w+(?:\s+\w+)*):\s*(\d+)%/gi,
      /(\w+(?:\s+\w+)*)\s*score:\s*(\d+)/gi,
      /(\w+(?:\s+\w+)*)\s*puntuación:\s*(\d+)/gi,
      /(\w+(?:\s+\w+)*)\s*valoración:\s*(\d+)/gi,
      /(\w+(?:\s+\w+)*)\s*rating:\s*(\d+)/gi,
      /(\w+(?:\s+\w+)*)\s*es de\s*:?\s*(\d+)/gi,
      /(\w+(?:\s+\w+)*)\s*tiene\s*:?\s*(\d+)\s*puntos/gi,
      /(\w+(?:\s+\w+)*)\s*obtiene\s*:?\s*(\d+)/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const [, metric, score] = match;
        if (metric && score) {
          // Normalize metric name by removing spaces and converting to lowercase
          const normalizedMetric = metric.toLowerCase().trim().replace(/\s+/g, '_');
          metrics[normalizedMetric] = parseInt(score, 10);
        }
      }
    }
    
    return metrics;
  };
  
  const metrics = extractMetrics(content);
  const hasMetrics = Object.keys(metrics).length > 0;
  
  // Define default metrics if none are found but should be present
  const defaultMetrics = {
    'velocidad_de_carga': metrics['velocidad_de_carga'] || metrics['page_speed'] || metrics['speed'] || 0,
    'seo_técnico': metrics['seo_técnico'] || metrics['technical_seo'] || metrics['seo_general'] || 0,
    'optimización_móvil': metrics['optimización_móvil'] || metrics['mobile_optimization'] || metrics['mobile'] || 0,
    'rendimiento': metrics['rendimiento'] || metrics['performance'] || 0,
    'accesibilidad': metrics['accesibilidad'] || metrics['accessibility'] || 0,
    'mejores_prácticas': metrics['mejores_prácticas'] || metrics['best_practices'] || 0,
    'seo_on-page': metrics['seo_on-page'] || metrics['on_page_seo'] || 0
  };
  
  // Combine extracted and default metrics
  const finalMetrics = { ...defaultMetrics, ...metrics };
  
  return (
    <div className="space-y-6">
      <ReportSection 
        title="Análisis Técnico SEO" 
        content={content} 
        sectionKey="technicalSEO"
        isEditing={isEditing}
        onEdit={onSave}
      />
      
      {hasMetrics && (
        <Card className="mt-6 border border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Métricas Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(finalMetrics).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 p-3 rounded-md bg-background/80 border border-border/50">
                  <div className={`rounded-full p-1.5 ${value > 70 ? 'bg-green-500/10 text-green-500' : value > 40 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                    {value > 70 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-muted-foreground">{value}/100</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TechnicalTab;
