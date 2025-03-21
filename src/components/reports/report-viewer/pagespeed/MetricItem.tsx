
import React from 'react';

export interface MetricItemProps {
  name?: string;  // Add 'name' property that's used in DeviceScoreCard
  title?: string;
  value?: number;
  unit?: string;
  description?: string;
  isCLS?: boolean; // Add isCLS property for formatting CLS values
}

const MetricItem: React.FC<MetricItemProps> = ({ 
  name, 
  title, 
  value, 
  unit, 
  description,
  isCLS = false
}) => {
  // Use name as title if title is not provided
  const displayTitle = title || name;
  
  // Format the value based on the unit or isCLS flag
  const formattedValue = value !== undefined ? 
    (isCLS ? value.toFixed(3) : (unit === 'ms' ? Math.round(value) : value.toFixed(2))) : 
    'N/A';

  return (
    <div className="p-3 rounded-lg border border-border/50 bg-card">
      <h4 className="text-sm font-medium mb-1">{displayTitle}</h4>
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
