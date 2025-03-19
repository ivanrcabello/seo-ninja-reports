
import React from 'react';
import DeleteReportButton from './DeleteReportButton';

interface ReportDetailActionsProps {
  onDeleteReport: () => Promise<void>;
}

const ReportDetailActions: React.FC<ReportDetailActionsProps> = ({ onDeleteReport }) => {
  return (
    <div className="flex items-center gap-2 self-end sm:self-auto">
      <DeleteReportButton onDelete={onDeleteReport} />
    </div>
  );
};

export default ReportDetailActions;
