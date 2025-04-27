
import React from 'react';
import { Client } from '@/types/client.types';
import { TabsContent } from "@/components/ui/tabs";
import ClientTabNavigation from './ClientTabNavigation';
import ClientOverview from './ClientOverview';
import ClientDocumentsList from './ClientDocumentsList';
import ClientProposals from './proposals/ClientProposals';
import ClientContracts from './contracts/ClientContracts';
import ClientInvoices from './invoices/ClientInvoices';
import ClientTasks from './timeline/ClientTasks';
import ClientPortalTab from './portal/ClientPortalTab';

interface ClientDetailContentProps {
  client: Client;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clientId: string;
}

const ClientDetailContent: React.FC<ClientDetailContentProps> = ({ 
  client, 
  activeTab, 
  setActiveTab,
  clientId 
}) => {
  return (
    <div className="space-y-6">
      {/* Custom tab navigation component */}
      <ClientTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Tab content sections */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <ClientOverview 
            client={client}
          />
        )}
        
        {activeTab === 'documents' && (
          <ClientDocumentsList 
            clientId={client.id} 
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
        
        {activeTab === 'portal' && (
          <ClientPortalTab
            clientId={client.id}
            clientName={client.name}
          />
        )}
      </div>
    </div>
  );
};

export default ClientDetailContent;
