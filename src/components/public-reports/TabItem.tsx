
import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TabItemProps {
  value: string;
  icon: LucideIcon;
  label: string;
  shortLabel: string;
  hasContent?: boolean;
  isNew?: boolean;
  color?: string;
}

const TabItem: React.FC<TabItemProps> = ({ 
  value, 
  icon: Icon, 
  label, 
  shortLabel, 
  hasContent = true,
  isNew = false,
  color = 'bg-primary/20 text-primary hover:bg-primary/30'
}) => {
  return (
    <TabsTrigger 
      value={value} 
      className={cn(
        "py-2 px-3 relative rounded-full transition-all duration-200 ease-in-out",
        "data-[state=active]:scale-105",
        "data-[state=active]:shadow-md",
        "data-[state=active]:font-medium",
        color,
        !hasContent && "opacity-50 cursor-not-allowed"
      )}
      disabled={!hasContent}
    >
      <div className="flex items-center gap-1.5">
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{shortLabel}</span>
        
        {isNew && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 text-[10px] h-5 bg-yellow-500 text-primary-foreground px-1.5 animate-pulse"
          >
            NUEVO
          </Badge>
        )}
      </div>
    </TabsTrigger>
  );
};

export default TabItem;
