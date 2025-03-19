
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
    return (
      <div className="p-8 text-center rounded-lg border bg-card/50 backdrop-blur-sm shadow-sm">
        <h2 className="text-xl font-medium text-muted-foreground">Informe no encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">El informe que buscas no existe o no está disponible.</p>
      </div>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden backdrop-blur-sm border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-background to-background/80">
        <ReportHeader report={report} />
      </CardHeader>
      <CardContent className="overflow-auto flex-1 p-0 pt-4">
        <ReportTabs report={report} />
      </CardContent>
    </Card>
  );
};

export default ReportViewer;
