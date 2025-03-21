
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ReportSection from '../report-section/ReportSection';
import { CustomSection } from '@/types/report.types';

interface CustomTabsProps {
  customSections: CustomSection[];
  isEditing: boolean;
  onSaveEdit: (section: string, content: string) => Promise<void>;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ 
  customSections, 
  isEditing, 
  onSaveEdit 
}) => {
  if (!customSections || !customSections.length) {
    return null;
  }
  
  return (
    <>
      {customSections.map((section) => (
        <TabsContent key={section.id} value={section.id}>
          <ReportSection 
            title={section.title} 
            content={section.content} 
            sectionKey={section.id}
            isEditing={isEditing}
            onEdit={(content) => onSaveEdit(section.id, content)}
          />
        </TabsContent>
      ))}
    </>
  );
};

export default CustomTabs;
