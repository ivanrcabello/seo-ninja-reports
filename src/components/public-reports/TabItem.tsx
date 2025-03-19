
import React from 'react';
import { TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

interface TabItemProps {
  value: string;
  icon: LucideIcon;
  label: string;
  shortLabel: string;
}

const TabItem: React.FC<TabItemProps> = ({ value, icon: Icon, label, shortLabel }) => {
  return (
    <TabsTrigger value={value} className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
      <div className="flex items-center gap-1.5">
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{shortLabel}</span>
      </div>
    </TabsTrigger>
  );
};

export default TabItem;
