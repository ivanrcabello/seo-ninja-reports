
import React, { useEffect, useRef } from 'react';
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
  activeTab: 'overview' | 'reports' | 'proposals' | 'contracts' | 'invoices';
  setActiveTab: (tab: 'overview' | 'reports' | 'proposals' | 'contracts' | 'invoices') => void;
  clientId: string;
}

const ClientDetailContent: React.FC<ClientDetailContentProps> = ({
  client,
  reports,
  activeTab,
  setActiveTab,
  clientId
}) => {
  // Crear una referencia para controlar si el componente está montado
  const isMounted = useRef(true);

  // Improved cleanup that forces any popovers or dialogs to close
  useEffect(() => {
    console.log("Tab changed to:", activeTab);
    
    // Función mejorada para cerrar cualquier modal o diálogo abierto
    const closeAnyModals = () => {
      // Click on document body to close any open popovers
      document.body.click();
      
      // Find and click any open dialogs' close buttons
      const closeButtons = document.querySelectorAll('[data-state="open"] button[aria-label="Close"]');
      closeButtons.forEach(button => {
        if (button instanceof HTMLElement) {
          button.click();
        }
      });
      
      // Cerrar cualquier menú desplegable que pudiera estar abierto
      const dropdownMenus = document.querySelectorAll('[data-state="open"][data-radix-dropdown-menu-content]');
      dropdownMenus.forEach(menu => {
        document.body.click(); // Esto suele cerrar menús desplegables
      });
    };
    
    closeAnyModals();
    
    // Hacer que el componente se registre como montado
    isMounted.current = true;
    
    // Make sure to clean up properly when component unmounts
    return () => {
      // Marcar que el componente se ha desmontado para evitar actualizaciones de estado
      isMounted.current = false;
      
      // Intentar cerrar modales otra vez para asegurar que no queda nada abierto
      closeAnyModals();
      
      // Añadir un timeout para asegurar que otras operaciones asíncronas tengan tiempo de completarse
      setTimeout(() => {
        if (document.body) {
          document.body.click();
        }
      }, 0);
    };
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    // Solo cambiar el tab si el componente está montado
    if (isMounted.current) {
      console.log("Tab changing from", activeTab, "to", value);
      setActiveTab(value as 'overview' | 'reports' | 'proposals' | 'contracts' | 'invoices');
    }
  };

  return (
    <AnimatedContainer animation="slide-up">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto mb-6 bg-muted/80 rounded-lg p-1">
          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Resumen</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Informes</TabsTrigger>
          <TabsTrigger value="proposals" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Propuestas</TabsTrigger>
          <TabsTrigger value="contracts" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Contratos</TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Facturas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <ClientOverview 
            client={client} 
            reports={reports} 
            onViewReports={() => setActiveTab('reports')}
            onCreateReport={() => setActiveTab('reports')}
          />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <ClientReportsList 
            client={client} 
            reports={reports} 
            onCreateReport={() => {
              // Set activeTab to 'reports' and display ReportGenerator component
              console.log("Creating new report for client:", clientId);
              // We'll handle this with the ReportGenerator component which should
              // already be configured for the client
              const reportGeneratorEl = document.getElementById('report-generator');
              if (reportGeneratorEl) {
                reportGeneratorEl.scrollIntoView({ behavior: 'smooth' });
              }
            }} 
          />
          <div id="report-generator" className="mt-8">
            <ReportGenerator clientId={clientId} />
          </div>
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
