
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface MetricItemProps {
  label: string;
  value: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
    <span className="text-sm">{label}</span>
    <Badge variant="outline" className="font-mono bg-primary/5">
      {value}
    </Badge>
  </div>
);

export default MetricItem;
