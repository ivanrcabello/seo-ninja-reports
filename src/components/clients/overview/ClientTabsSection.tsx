
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { BusinessProfile } from '@/types/report.types';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import ClientSummaryTab from './ClientSummaryTab';
import ClientGmbTab from '../tabs/ClientGmbTab';
import ClientPageSpeedTab from '../tabs/ClientPageSpeedTab';
import ClientCredentials from '../ClientCredentials';
import ClientKeywords from '../keywords/ClientKeywords';
import SeoReportingDashboard from '../seo-reporting/SeoReportingDashboard';

interface ClientTabsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  client: Client;
  reports: Report[];
  onViewReports: () => void;
  onCreateReport: () => void;
  onBusinessProfileUpdate: (profile: Partial<BusinessProfile>) => void;
  onPageSpeedUpdate: (score: number) => void;
  businessProfile: Partial<BusinessProfile> | null;
  pageSpeedScore: number | null | undefined;
  clientWebsite: string;
  clientName?: string;
  clientLocation?: string;
  clientId: string;
  isRefreshingBusinessProfile: boolean;
  isRefreshingPageSpeed: boolean;
  onRefreshBusinessProfile: () => void;
  onRefreshPageSpeed: () => void;
}

const ClientTabsSection: React.FC<ClientTabsSectionProps> = ({
  activeTab,
  setActiveTab,
  client,
  reports,
  onViewReports,
  onCreateReport,
  onBusinessProfileUpdate,
  onPageSpeedUpdate,
  businessProfile,
  pageSpeedScore,
  clientWebsite,
  clientName,
  clientLocation,
  clientId,
  isRefreshingBusinessProfile,
  isRefreshingPageSpeed,
  onRefreshBusinessProfile,
  onRefreshPageSpeed
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="grid grid-cols-6 mb-4 bg-muted/80 rounded-lg p-1">
        <TabsTrigger value="summary" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Resumen</TabsTrigger>
        <TabsTrigger value="gmb" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Google Negocio</TabsTrigger>
        <TabsTrigger value="pagespeed" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Rendimiento</TabsTrigger>
        <TabsTrigger value="keywords" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Palabras Clave</TabsTrigger>
        <TabsTrigger value="seo-reporting" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Informes SEO</TabsTrigger>
        <TabsTrigger value="credentials" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Credenciales</TabsTrigger>
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
          
          <TabsContent value="gmb">
            <ClientGmbTab 
              clientId={client.id}
              clientName={client.name}
              clientLocation={client.industry}
              businessProfile={businessProfile}
              isRefreshingBusinessProfile={isRefreshingBusinessProfile}
              onRefreshBusinessProfile={onRefreshBusinessProfile}
              onBusinessProfileUpdate={onBusinessProfileUpdate}
            />
          </TabsContent>
          
          <TabsContent value="pagespeed">
            <ClientPageSpeedTab 
              clientWebsite={clientWebsite}
              pageSpeedScore={pageSpeedScore}
              isRefreshingPageSpeed={isRefreshingPageSpeed}
              onRefreshPageSpeed={onRefreshPageSpeed}
              onPageSpeedUpdate={onPageSpeedUpdate}
            />
          </TabsContent>
          
          <TabsContent value="keywords">
            <ClientKeywords
              clientId={clientId}
              reports={reports}
            />
          </TabsContent>
          
          <TabsContent value="seo-reporting">
            <SeoReportingDashboard clientId={clientId} />
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
