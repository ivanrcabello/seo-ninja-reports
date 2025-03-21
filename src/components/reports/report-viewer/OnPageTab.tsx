
import React from 'react';
import ReportSection from '../report-section/ReportSection';

interface OnPageTabProps {
  content: string;
  isEditing?: boolean;
  onSave?: (content: string) => Promise<void>;
}

const OnPageTab: React.FC<OnPageTabProps> = ({ 
  content, 
  isEditing = false,
  onSave 
}) => {
  return (
    <ReportSection 
      title="Análisis On-Page SEO" 
      content={content} 
      sectionKey="onPageSEO"
      isEditing={isEditing}
      onEdit={onSave}
    />
  );
};

export default OnPageTab;
