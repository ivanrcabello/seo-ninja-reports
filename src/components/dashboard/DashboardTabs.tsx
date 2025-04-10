
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';

import OverviewTab from './tabs/OverviewTab';
import ClientsTab from './tabs/ClientsTab';
import ReportsTab from './tabs/ReportsTab';
import InvoicesTab from './InvoicesTab';
import ActivityTab from './tabs/ActivityTab';
import CalendarTab from './tabs/CalendarTab';
import TasksTab from './tabs/TasksTab';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  clients: Client[];
  reports: Report[];
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  clients,
  reports
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Vista general</TabsTrigger>
        <TabsTrigger value="clients">Clientes</TabsTrigger>
        <TabsTrigger value="reports">Informes</TabsTrigger>
        <TabsTrigger value="invoices">Facturas</TabsTrigger>
        <TabsTrigger value="calendar">Calendario</TabsTrigger>
        <TabsTrigger value="tasks">Tareas</TabsTrigger>
        <TabsTrigger value="activity">Actividad</TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsTab clients={clients} reports={reports} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab reports={reports} />
          </TabsContent>

          <TabsContent value="invoices">
            <AnimatePresence>
              <InvoicesTab />
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="calendar">
            <AnimatePresence>
              <CalendarTab />
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="tasks">
            <AnimatePresence>
              <TasksTab />
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityTab clients={clients} reports={reports} />
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
};

export default DashboardTabs;
