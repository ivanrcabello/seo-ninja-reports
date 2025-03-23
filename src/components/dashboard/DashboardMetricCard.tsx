
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface DashboardMetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType | string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  linkText: string;
  linkUrl: string;
  onClick?: () => void;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  trendDirection,
  linkText, 
  linkUrl, 
  onClick 
}) => {
  const IconComponent = typeof Icon === 'string' ? null : Icon as LucideIcon;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {IconComponent ? <IconComponent className="h-5 w-5 text-primary" /> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{value}</span>
            <span className={`text-xs ml-2 ${
              trendDirection === 'up' ? 'text-green-600' :
              trendDirection === 'down' ? 'text-red-600' :
              'text-gray-500'
            }`}>
              {trend}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="link" className="p-0 h-auto text-primary" asChild onClick={onClick}>
          <Link to={linkUrl}>{linkText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
