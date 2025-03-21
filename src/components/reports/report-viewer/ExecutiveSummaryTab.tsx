
import React from 'react';
import ReportSection from '../report-section/ReportSection';

interface ExecutiveSummaryTabProps {
  content: string;
  isEditing?: boolean;
  onSave?: (content: string) => Promise<void>;
}

const ExecutiveSummaryTab: React.FC<ExecutiveSummaryTabProps> = ({ 
  content, 
  isEditing = false,
  onSave 
}) => {
  return (
    <ReportSection 
      title="Resumen Ejecutivo" 
      content={content} 
      sectionKey="executiveSummary"
      isEditing={isEditing}
      onEdit={onSave}
    />
  );
};

export default ExecutiveSummaryTab;
