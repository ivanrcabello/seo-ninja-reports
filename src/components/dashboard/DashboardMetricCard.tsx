
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && (
            <p className={`text-xs flex items-center mt-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <span className="mr-1">
                {trend.isPositive ? '↑' : '↓'}
              </span>
              {trend.value}%
            </p>
          )}
          {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
    </Card>
  );
};
