
import React from 'react';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import { TabsContent } from "@/components/ui/tabs";
import ClientTabNavigation from './ClientTabNavigation';
import ClientOverview from './ClientOverview';
import ClientReportsList from './ClientReportsList';
import ClientProposals from './proposals/ClientProposals';
import ClientContracts from './contracts/ClientContracts';
import ClientInvoices from './invoices/ClientInvoices';
import ClientTasks from './timeline/ClientTasks';

interface ClientDetailContentProps {
  client: Client;
  reports: Report[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clientId: string;
}

const ClientDetailContent: React.FC<ClientDetailContentProps> = ({ 
  client, 
  reports, 
  activeTab, 
  setActiveTab,
  clientId 
}) => {
  // Handler to view all reports for the client
  const handleViewReports = () => {
    setActiveTab('reports');
  };
  
  // Handler to create a new report
  const handleCreateReport = () => {
    setActiveTab('reports');
    // Any additional logic for report creation can be added here
  };

  return (
    <div className="space-y-6">
      {/* Custom tab navigation component */}
      <ClientTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Tab content sections */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <ClientOverview 
            client={client}
            reports={reports}
            onViewReports={handleViewReports}
            onCreateReport={handleCreateReport}
          />
        )}
        
        {activeTab === 'reports' && (
          <ClientReportsList 
            client={client} 
            reports={reports} 
            onCreateReport={handleCreateReport} 
          />
        )}
        
        {activeTab === 'proposals' && (
          <ClientProposals 
            clientId={client.id} 
            clientName={client.name} 
          />
        )}
        
        {activeTab === 'contracts' && (
          <ClientContracts 
            clientId={client.id} 
            clientName={client.name} 
          />
        )}
        
        {activeTab === 'invoices' && (
          <ClientInvoices 
            clientId={client.id} 
            clientName={client.name} 
          />
        )}
        
        {activeTab === 'tasks' && (
          <ClientTasks 
            clientId={client.id} 
            clientName={client.name} 
          />
        )}
      </div>
    </div>
  );
};

export default ClientDetailContent;
