
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { BusinessProfile } from '@/types/report.types';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import ClientSummaryTab from './ClientSummaryTab';
import ClientGmbTest from '../tests/ClientGmbTest';
import ClientPageSpeedTest from '../tests/ClientPageSpeedTest';
import ClientBusinessSearch from '../tests/ClientBusinessSearch';
import ClientCredentials from '../ClientCredentials';

interface ClientTabsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  client: Client;
  reports: Report[];
  onViewReports: () => void;
  onCreateReport: () => void;
  onBusinessProfileUpdate: (profile: Partial<BusinessProfile>) => void;
  onPageSpeedUpdate: (score: number) => void;
}

const ClientTabsSection: React.FC<ClientTabsSectionProps> = ({
  activeTab,
  setActiveTab,
  client,
  reports,
  onViewReports,
  onCreateReport,
  onBusinessProfileUpdate,
  onPageSpeedUpdate
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="tests">Tests Rápidos</TabsTrigger>
        <TabsTrigger value="credentials">Credenciales</TabsTrigger>
      </TabsList>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          <TabsContent value="summary">
            <ClientSummaryTab 
              client={client}
              reports={reports}
              onViewReports={onViewReports}
              onCreateReport={onCreateReport}
            />
          </TabsContent>
          
          <TabsContent value="tests" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ClientGmbTest 
                clientId={client.id} 
                clientWebsite={client.website}
                onProfileUpdate={onBusinessProfileUpdate}
              />
              <ClientPageSpeedTest 
                websiteUrl={client.website}
                onScoreUpdate={onPageSpeedUpdate}
              />
            </div>
            
            {/* ValueSerp-based business search component */}
            <ClientBusinessSearch 
              clientId={client.id}
              onProfileUpdate={onBusinessProfileUpdate}
            />
          </TabsContent>
          
          <TabsContent value="credentials">
            <ClientCredentials client={client} />
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
};

export default ClientTabsSection;
