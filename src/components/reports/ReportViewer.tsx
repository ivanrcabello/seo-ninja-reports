
import React from 'react';
import { Report } from '@/types/report.types';
import ReportViewerComponent from './report-viewer/ReportViewer';

interface ReportViewerProps {
  reportId?: string;
  report?: Report;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportId, report }) => {
  return <ReportViewerComponent reportId={reportId} report={report} />;
};

export default ReportViewer;
