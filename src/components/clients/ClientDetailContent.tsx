
import React, { lazy, Suspense } from 'react';
import { Client } from '@/types/client.types';
import { Loader2 } from 'lucide-react';
import ClientTabNavigation from './ClientTabNavigation';
import ClientOverview from './ClientOverview';

// Lazy-load components para mejorar rendimiento
const ClientDocumentsList = lazy(() => import('./ClientDocumentsList'));
const ClientInvoices = lazy(() => import('./invoices/ClientInvoices'));
const ClientContracts = lazy(() => import('./contracts/ClientContracts'));
const ClientTasks = lazy(() => import('./timeline/ClientTasks'));
const ClientPortalTab = lazy(() => import('./portal/ClientPortalTab'));

// Componente de carga
const TabLoader = () => (
  <div className="flex justify-center items-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

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
  // Renderiza solo el tab activo para evitar problemas de rendimiento
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ClientOverview client={client} />;
        
      case 'documents':
        return (
          <Suspense fallback={<TabLoader />}>
            <ClientDocumentsList clientId={client.id} />
          </Suspense>
        );
        
      case 'invoices':
        return (
          <Suspense fallback={<TabLoader />}>
            <ClientInvoices clientId={client.id} clientName={client.name} />
          </Suspense>
        );
        
      case 'contracts':
        return (
          <Suspense fallback={<TabLoader />}>
            <ClientContracts clientId={client.id} clientName={client.name} />
          </Suspense>
        );
        
      case 'tasks':
        return (
          <Suspense fallback={<TabLoader />}>
            <ClientTasks clientId={client.id} clientName={client.name} />
          </Suspense>
        );
        
      case 'portal':
        return (
          <Suspense fallback={<TabLoader />}>
            <ClientPortalTab clientId={client.id} clientName={client.name} />
          </Suspense>
        );
        
      default:
        return <ClientOverview client={client} />;
    }
  };

  return (
    <div className="space-y-6">
      <ClientTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-4">
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

export default ClientDetailContent;
