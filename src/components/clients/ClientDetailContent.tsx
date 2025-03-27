
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

  // Determine which tab content to render
  switch (activeTab) {
    case 'overview':
      return (
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
      );
    case 'reports':
      return <ClientReportsList client={client} reports={reports} onCreateReport={handleCreateReport} />;
    case 'proposals':
      return <ClientProposalsList client={client} />;
    case 'contracts':
      return <ClientContractsList client={client} />;
    case 'invoices':
      return <ClientInvoicesList client={client} />;
    default:
      return null;
  }
};

export default ClientDetailContent;
