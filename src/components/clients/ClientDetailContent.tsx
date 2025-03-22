
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportGenerator from '@/components/reports/ReportGenerator';
import ClientOverview from './ClientOverview';
import ClientReportsList from './ClientReportsList';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import ClientProposals from './proposals/ClientProposals';

interface ClientDetailContentProps {
  client: Client;
  reports: Report[];
  activeTab: 'overview' | 'reports' | 'new-report' | 'proposals';
  setActiveTab: (tab: 'overview' | 'reports' | 'new-report' | 'proposals') => void;
  clientId: string;
}

const ClientDetailContent: React.FC<ClientDetailContentProps> = ({
  client,
  reports,
  activeTab,
  setActiveTab,
  clientId
}) => {
  return (
    <AnimatedContainer animation="slide-up">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'overview' | 'reports' | 'new-report' | 'proposals')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="new-report">New Report</TabsTrigger>
          <TabsTrigger value="proposals">Propuestas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <ClientOverview 
            client={client} 
            reports={reports} 
            onViewReports={() => setActiveTab('reports')}
            onCreateReport={() => setActiveTab('new-report')}
          />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <ClientReportsList 
            client={client} 
            reports={reports} 
            onCreateReport={() => setActiveTab('new-report')}
          />
        </TabsContent>
        
        <TabsContent value="new-report" className="mt-6">
          <ReportGenerator clientId={clientId} />
        </TabsContent>
        
        <TabsContent value="proposals" className="mt-6">
          <ClientProposals clientId={clientId} />
        </TabsContent>
      </Tabs>
    </AnimatedContainer>
  );
};

export default ClientDetailContent;
