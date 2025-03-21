
import React from 'react';
import ReportSection from '../report-section/ReportSection';

interface TechnicalTabProps {
  content: string;
  isEditing?: boolean;
  onSave?: (content: string) => Promise<void>;
}

const TechnicalTab: React.FC<TechnicalTabProps> = ({ 
  content, 
  isEditing = false,
  onSave 
}) => {
  return (
    <ReportSection 
      title="Análisis Técnico SEO" 
      content={content} 
      sectionKey="technicalSEO"
      isEditing={isEditing}
      onEdit={onSave}
    />
  );
};

export default TechnicalTab;
