
import React from 'react';
import ReportSection from '../report-section/ReportSection';

interface ContentTabProps {
  content: string;
  isEditing?: boolean;
  onSave?: (content: string) => Promise<void>;
}

const ContentTab: React.FC<ContentTabProps> = ({ 
  content, 
  isEditing = false,
  onSave 
}) => {
  return (
    <ReportSection 
      title="Estrategia de Contenido" 
      content={content} 
      sectionKey="contentStrategy"
      isEditing={isEditing}
      onEdit={onSave}
    />
  );
};

export default ContentTab;
