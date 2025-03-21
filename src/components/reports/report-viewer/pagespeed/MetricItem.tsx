
import React from 'react';

export interface MetricItemProps {
  title?: string;
  value?: number;
  unit?: string;
  description?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ title, value, unit, description }) => {
  // Format the value based on the unit
  const formattedValue = value !== undefined ? 
    (unit === 'ms' ? Math.round(value) : value.toFixed(2)) : 
    'N/A';

  return (
    <div className="p-3 rounded-lg border border-border/50 bg-card">
      <h4 className="text-sm font-medium mb-1">{title}</h4>
      <div className="flex items-baseline">
        <span className="text-lg font-semibold mr-1">
          {formattedValue}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default MetricItem;
