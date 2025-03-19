
import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TabItemProps {
  value: string;
  icon: LucideIcon;
  label: string;
  shortLabel: string;
  hasContent?: boolean;
  isNew?: boolean;
}

const TabItem: React.FC<TabItemProps> = ({ 
  value, 
  icon: Icon, 
  label, 
  shortLabel, 
  hasContent = true,
  isNew = false 
}) => {
  return (
    <TabsTrigger 
      value={value} 
      className="py-2 relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
      disabled={!hasContent}
    >
      <div className="flex items-center gap-1.5">
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{shortLabel}</span>
        
        {isNew && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 text-[10px] h-5 bg-yellow-500 text-primary-foreground px-1.5"
          >
            NUEVO
          </Badge>
        )}
      </div>
    </TabsTrigger>
  );
};

export default TabItem;
