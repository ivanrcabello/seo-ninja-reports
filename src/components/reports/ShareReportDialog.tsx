
import React from 'react';
import ShareContentDialog from '../shared/ShareContentDialog';

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string; // Keep supporting reportId for backwards compatibility
  reportTitle: string;
  report?: {
    id: string;
    title: string;
    clientId?: string;
    summary?: string;
    content?: any;
    status?: string;
    url?: string;
  };
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
}

const ShareReportDialog: React.FC<ShareReportDialogProps> = ({
  open,
  onOpenChange,
  reportId,
  reportTitle,
  report,
  clientName = '',
  clientWebsite = '',
  onShared
}) => {
  // Use either the provided report.id or the reportId prop
  const effectiveReportId = report?.id || reportId;
  const effectiveReportTitle = report?.title || reportTitle;
  const reportData = report || { title: reportTitle };
  
  return (
    <ShareContentDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={effectiveReportId}
      contentType="report"
      contentTitle={effectiveReportTitle}
      contentData={reportData}
      contentStatus={report?.status || 'completed'}
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
    />
  );
};

export default ShareReportDialog;
