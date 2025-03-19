
import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface MetricItemProps {
  name: string;
  value: string;
  description: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ name, value, description }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
    <div className="flex flex-col">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>
    <Badge variant="outline" className="font-mono bg-primary/5">
      {value}
    </Badge>
  </div>
);

export default MetricItem;
