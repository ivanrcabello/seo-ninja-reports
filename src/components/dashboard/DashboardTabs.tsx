
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; 
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import ClientsTab from './tabs/ClientsTab';
import TasksTab from './tabs/TasksTab';
import OverviewTab from './tabs/OverviewTab';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clients: Client[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  clients,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="overview">General</TabsTrigger>
        <TabsTrigger value="clients">Clientes</TabsTrigger>
        <TabsTrigger value="tasks">Tareas</TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="overview">
          <OverviewTab clients={clients} />
        </TabsContent>
        
        <TabsContent value="clients">
          <ClientsTab clients={clients} />
        </TabsContent>

        <TabsContent value="tasks">
          <TasksTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default DashboardTabs;
