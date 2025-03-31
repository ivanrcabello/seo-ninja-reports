
import React from 'react';
import SimpleShareDialog from '../shared/SimpleShareDialog';

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string; 
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
  onGenerateShareUrl?: () => Promise<string>;
}

const ShareReportDialog: React.FC<ShareReportDialogProps> = ({
  open,
  onOpenChange,
  reportId,
  reportTitle,
  report,
  clientName = '',
  clientWebsite = '',
  onShared,
  onGenerateShareUrl
}) => {
  // Use either the provided report.id or the reportId prop
  const effectiveReportId = report?.id || reportId;
  const effectiveReportTitle = report?.title || reportTitle;
  const reportData = report || { title: reportTitle };
  
  return (
    <SimpleShareDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={effectiveReportId}
      contentType="report"
      title={effectiveReportTitle}
      data={reportData}
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
      onGenerateShareUrl={onGenerateShareUrl}
    />
  );
};

export default ShareReportDialog;
