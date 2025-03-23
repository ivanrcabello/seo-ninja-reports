
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportGenerator from '@/components/reports/ReportGenerator';
import ClientOverview from './ClientOverview';
import ClientReportsList from './ClientReportsList';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import ClientProposals from './proposals/ClientProposals';
import ClientContracts from './contracts/ClientContracts';
import ClientInvoices from './invoices/ClientInvoices';

interface ClientDetailContentProps {
  client: Client;
  reports: Report[];
  activeTab: 'overview' | 'reports' | 'new-report' | 'proposals' | 'contracts' | 'invoices';
  setActiveTab: (tab: 'overview' | 'reports' | 'new-report' | 'proposals' | 'contracts' | 'invoices') => void;
  clientId: string;
}

const ClientDetailContent: React.FC<ClientDetailContentProps> = ({
  client,
  reports,
  activeTab,
  setActiveTab,
  clientId
}) => {
  // Force cleanup of any popovers or dialogs when tab changes
  useEffect(() => {
    console.log("Tab changed to:", activeTab);
    
    // Close any open popups or dialogs when tab changes
    const closeAnyModals = () => {
      // This helps force the UI to release any stuck dialogs
      document.body.click();
    };
    
    closeAnyModals();
    
    // Cleanup function
    return () => {
      closeAnyModals();
    };
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    console.log("Tab changing from", activeTab, "to", value);
    setActiveTab(value as 'overview' | 'reports' | 'new-report' | 'proposals' | 'contracts' | 'invoices');
  };

  return (
    <AnimatedContainer animation="slide-up">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-6 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="new-report">New Report</TabsTrigger>
          <TabsTrigger value="proposals">Propuestas</TabsTrigger>
          <TabsTrigger value="contracts">Contratos</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
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
        
        <TabsContent value="contracts" className="mt-6">
          <ClientContracts 
            key={`contracts-${clientId}-${activeTab}`} 
            clientId={clientId} 
            clientName={client.name} 
          />
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-6">
          <ClientInvoices 
            key={`invoices-${clientId}-${activeTab}`} 
            clientId={clientId} 
            clientName={client.name} 
          />
        </TabsContent>
      </Tabs>
    </AnimatedContainer>
  );
};

export default ClientDetailContent;
