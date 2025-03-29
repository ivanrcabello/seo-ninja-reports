
import React from 'react';
import { ReportTabs } from './ReportTabs';
import { PublicReport } from './useReportData';
import { ContentTab } from './ContentTab';

interface ReportContentsProps {
  report: PublicReport;
}

export const ReportContents: React.FC<ReportContentsProps> = ({ report }) => {
  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
      <ReportTabs report={report} />
    </div>
  );
};
