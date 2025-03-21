
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import RefreshButton from './RefreshButton';

interface PerformanceCardProps {
  title: string;
  icon: ReactNode;
  badgeText: string;
  badgeClassName: string;
  isDataAvailable: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  tooltipText: string;
  children: ReactNode;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  icon,
  badgeText,
  badgeClassName,
  isDataAvailable,
  onRefresh,
  isRefreshing,
  tooltipText,
  children
}) => {
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md",
      !isDataAvailable && "opacity-70"
    )}>
      <div className="pb-2 px-6 pt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium flex items-center">
            {icon}
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={badgeClassName}>
              {badgeText}
            </Badge>
            <RefreshButton 
              onClick={onRefresh} 
              isRefreshing={isRefreshing} 
              tooltipText={tooltipText} 
            />
          </div>
        </div>
      </div>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
