
import React from 'react';
import { ReportTabs } from './ReportTabs';
import { PublicReport } from './useReportData';

export interface PublicReportContentProps {
  report: PublicReport;
  passwordRequired?: boolean;
  onPasswordRequested?: () => void;
  errorMessage?: string;
  passwordInputOpen?: boolean;
  onPasswordSubmit?: (password: string) => void;
  onPasswordCancel?: () => void;
}

export const PublicReportContent: React.FC<PublicReportContentProps> = ({ 
  report,
  passwordRequired = false,
  onPasswordRequested = () => {},
  errorMessage = '',
  passwordInputOpen = false,
  onPasswordSubmit = () => {},
  onPasswordCancel = () => {}
}) => {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
      <ReportTabs report={report} />
    </div>
  );
};
