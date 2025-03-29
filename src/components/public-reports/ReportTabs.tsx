
import React from 'react';
import { PublicReport } from './useReportData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentTab } from './ContentTab';
import { TabItem } from './TabItem';

interface ReportTabsProps {
  report: PublicReport;
}

export const ReportTabs: React.FC<ReportTabsProps> = ({ report }) => {
  const [activeTab, setActiveTab] = React.useState('summary');

  const tabs = [
    { id: 'summary', label: 'Resumen Ejecutivo', content: report.executive_summary },
    { id: 'content', label: 'Contenido del Informe', content: report.content }
  ];

  return (
    <Tabs 
      defaultValue="summary" 
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="p-6"
    >
      <TabsList className="mb-4">
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="summary" className="mt-4">
        {report.executive_summary ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report.executive_summary }} />
        ) : (
          <p className="text-muted-foreground">No hay resumen ejecutivo disponible para este informe.</p>
        )}
      </TabsContent>

      <TabsContent value="content" className="mt-4">
        <ContentTab content={report.content} />
      </TabsContent>
    </Tabs>
  );
};
