
import React from 'react';
import { Report } from '@/types/report.types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ReportHeader from './ReportHeader';
import ReportTabs from './ReportTabs';

interface ReportViewerProps {
  report: Report | undefined;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  if (!report) {
    return <p>Informe no encontrado.</p>;
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <ReportHeader report={report} />
      </CardHeader>
      <CardContent className="overflow-auto flex-1">
        <ReportTabs report={report} />
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
