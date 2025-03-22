
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { extractNumericValue } from './visualization-utils';

interface MetricsVisualizerProps {
  title: string;
  text: string;
  searchTerm?: string;
  icon?: React.ReactNode;
  maxValue?: number;
  defaultValue?: number;
}

export const MetricsVisualizer: React.FC<MetricsVisualizerProps> = ({ 
  title, 
  text, 
  searchTerm,
  icon,
  maxValue = 100,
  defaultValue = 50
}) => {
  const [value, setValue] = useState<number>(defaultValue);

  useEffect(() => {
    if (text && searchTerm) {
      const extractedValue = extractNumericValue(text, searchTerm, maxValue);
      if (extractedValue !== null) {
        setValue(extractedValue);
      }
    }
  }, [text, searchTerm, maxValue]);

  const getColorClass = () => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-blue-500';
    if (value >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getProgressClass = () => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {icon && icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span className={getColorClass()}>{value}%</span>
        </div>
        <Progress className="h-2" value={value} indicatorClassName={getProgressClass()} />
      </CardContent>
    </Card>
  );
};
