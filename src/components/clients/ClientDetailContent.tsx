
import React, { useState } from 'react';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import { BusinessProfile } from '@/types/report.types';
import ClientTabsSection from './overview/ClientTabsSection';
import ClientReportsList from './ClientReportsList';
import ClientProposalsList from './ClientProposalsList';
import ClientContractsList from './ClientContractsList';
import ClientInvoicesList from './ClientInvoicesList';
import ReportGeneratorWrapper from '@/components/reports/ReportGeneratorWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [isRefreshingBusinessProfile, setIsRefreshingBusinessProfile] = useState(false);
  const [isRefreshingPageSpeed, setIsRefreshingPageSpeed] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<Partial<BusinessProfile> | null>(null);
  const [pageSpeedScore, setPageSpeedScore] = useState<number | null>(null);
  
  // The handler to view all reports for the client
  const handleViewReports = () => {
    setActiveTab('reports');
  };
  
  // The handler to create a new report, showing the report generator
  const handleCreateReport = () => {
    setShowReportGenerator(true);
  };
  
  // Handler to close the report generator
  const handleCloseReportGenerator = () => {
    setShowReportGenerator(false);
  };

  // Handlers for business profile
  const handleBusinessProfileUpdate = (profile: Partial<BusinessProfile>) => {
    setBusinessProfile(profile);
  };

  // Handler for PageSpeed updates
  const handlePageSpeedUpdate = (score: number) => {
    setPageSpeedScore(score);
  };

  // Handlers for refreshing data
  const handleRefreshBusinessProfile = () => {
    setIsRefreshingBusinessProfile(true);
    // Add your refresh logic here
    setTimeout(() => setIsRefreshingBusinessProfile(false), 1500);
  };

  const handleRefreshPageSpeed = () => {
    setIsRefreshingPageSpeed(true);
    // Add your refresh logic here
    setTimeout(() => setIsRefreshingPageSpeed(false), 1500);
  };

  // If showing the report generator, render it instead of the tabs
  if (showReportGenerator) {
    return (
      <ReportGeneratorWrapper 
        clientId={clientId} 
        onBack={handleCloseReportGenerator} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="text-sm">Resumen</TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">Informes</TabsTrigger>
          <TabsTrigger value="proposals" className="text-sm">Propuestas</TabsTrigger>
          <TabsTrigger value="contracts" className="text-sm">Contratos</TabsTrigger>
          <TabsTrigger value="invoices" className="text-sm">Facturas</TabsTrigger>
        </TabsList>

        {/* Tab content */}
        <TabsContent value="overview" className="mt-4">
          <ClientTabsSection
            activeTab="summary"
            setActiveTab={() => {}}
            client={client}
            reports={reports}
            onViewReports={handleViewReports}
            onCreateReport={handleCreateReport}
            onBusinessProfileUpdate={handleBusinessProfileUpdate}
            onPageSpeedUpdate={handlePageSpeedUpdate}
            businessProfile={businessProfile}
            pageSpeedScore={pageSpeedScore}
            clientWebsite={client.website}
            clientName={client.name}
            clientLocation={client.industry}
            clientId={clientId}
            isRefreshingBusinessProfile={isRefreshingBusinessProfile}
            isRefreshingPageSpeed={isRefreshingPageSpeed}
            onRefreshBusinessProfile={handleRefreshBusinessProfile}
            onRefreshPageSpeed={handleRefreshPageSpeed}
          />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <ClientReportsList 
            client={client} 
            reports={reports} 
            onCreateReport={handleCreateReport} 
          />
        </TabsContent>
        
        <TabsContent value="proposals" className="mt-4">
          <ClientProposalsList client={client} />
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-4">
          <ClientContractsList client={client} />
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-4">
          <ClientInvoicesList client={client} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailContent;
