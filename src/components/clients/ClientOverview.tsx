
import React from 'react';
import { Client } from '@/types/client.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientSummaryTab from './overview/ClientSummaryTab';
import ClientGmbTab from './tabs/ClientGmbTab';

interface ClientOverviewProps {
  client: Client;
}

const ClientOverview: React.FC<ClientOverviewProps> = ({ 
  client
}) => {
  const [activeTab, setActiveTab] = React.useState('summary');
  
  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="gmb">Google My Business</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <ClientSummaryTab client={client} />
        </TabsContent>
        
        <TabsContent value="gmb">
          <ClientGmbTab 
            clientId={client.id} 
            clientName={client.name}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientOverview;
