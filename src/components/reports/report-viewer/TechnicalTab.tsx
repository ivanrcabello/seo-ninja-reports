
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
  // Extract technical issues and metrics if available
  const extractMetrics = (text: string) => {
    const metrics: Record<string, number> = {};
    
    // Common patterns for scores in the text
    const patterns = [
      /(\w+):\s*(\d+)\/100/gi,
      /(\w+):\s*(\d+)%/gi,
      /(\w+)\s*score:\s*(\d+)/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const [, metric, score] = match;
        if (metric && score) {
          metrics[metric.toLowerCase()] = parseInt(score, 10);
        }
      }
    }
    
    return metrics;
  };
  
  const metrics = extractMetrics(content);
  const hasMetrics = Object.keys(metrics).length > 0;
  
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
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 p-3 rounded-md bg-background/80 border border-border/50">
                  <div className={`rounded-full p-1.5 ${value > 70 ? 'bg-green-500/10 text-green-500' : value > 40 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                    {value > 70 ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{key}</p>
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
