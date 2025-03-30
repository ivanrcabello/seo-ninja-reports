
import React from 'react';
import { Report } from '@/types/report.types';
import SimpleReportViewer from './SimpleReportViewer';

interface ReportViewerProps {
  reportId?: string;
  report?: Report;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportId, report }) => {
  console.log("ReportViewer wrapper rendering with:", { reportId, hasReport: !!report });
  
  if (!reportId && !report) {
    console.error("ReportViewer: No reportId or report provided");
    return <div className="text-red-500 p-4">Error: No report data available</div>;
  }
  
  return <SimpleReportViewer reportId={reportId} report={report} />;
};

export default ReportViewer;
