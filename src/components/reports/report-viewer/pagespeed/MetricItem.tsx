
import React from 'react';
import { formatNumber, getMetricClass, getMetricLabel } from './utils';

interface MetricItemProps {
  label: string;
  value: number | null | undefined;
  unit?: string;
  type?: 'time' | 'score' | 'percent';
}

const MetricItem: React.FC<MetricItemProps> = ({ 
  label, 
  value, 
  unit = 'ms', 
  type = 'time' 
}) => {
  // If value is undefined or null, show "N/A"
  if (value === undefined || value === null) {
    return (
      <div className="flex justify-between items-baseline py-2 border-b border-muted/30 last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">N/A</span>
      </div>
    );
  }

  // Format value based on type
  const formattedValue = type === 'time' 
    ? `${formatNumber(value)} ${unit}` 
    : type === 'percent' 
      ? `${formatNumber(value)}%` 
      : formatNumber(value);
  
  // Determine class based on value
  const valueClass = getMetricClass(label, value);
  
  // Get metric label if applicable
  const metricLabel = type === 'time' ? getMetricLabel(label, value) : null;
  
  return (
    <div className="flex justify-between items-baseline py-2 border-b border-muted/30 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex flex-col items-end">
        <span className={`text-sm font-medium ${valueClass}`}>{formattedValue}</span>
        {metricLabel && (
          <span className={`text-xs ${valueClass}/70`}>{metricLabel}</span>
        )}
      </div>
    </div>
  );
};

export default MetricItem;
