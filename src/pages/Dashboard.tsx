import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useAuth } from '@/context/AuthContext';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import { Loader2 } from 'lucide-react';
import usePersistentState from '@/hooks/usePersistentState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import refactored tab components
import OverviewTab from '@/components/dashboard/tabs/OverviewTab';
import ClientsTab from '@/components/dashboard/tabs/ClientsTab';
import ReportsTab from '@/components/dashboard/tabs/ReportsTab';
import InvoicesTab from '@/components/dashboard/tabs/InvoicesTab';
import ActivityTab from '@/components/dashboard/tabs/ActivityTab';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const { reports, isLoading: reportsLoading } = useReports();
  const [lastVisitedSection, setLastVisitedSection] = usePersistentState<string>('dashboard-section', '');
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = authLoading || clientsLoading || reportsLoading;
  
  // Store page visibility state
  useEffect(() => {
    const handleVisibilityChange = () => {
      // When page becomes visible again, we ensure we're at the last viewed section
      if (document.visibilityState === 'visible' && lastVisitedSection) {
        const element = document.getElementById(lastVisitedSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastVisitedSection]);

  // Track section visibility
  const trackSectionVisibility = (sectionId: string) => {
    setLastVisitedSection(sectionId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <AnimatedContainer animation="slide-up" className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Panel de Control</h1>
            <p className="text-muted-foreground">
              Gestiona tus clientes, informes SEO y facturas
            </p>
          </AnimatedContainer>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Vista general</TabsTrigger>
                  <TabsTrigger value="clients">Clientes</TabsTrigger>
                  <TabsTrigger value="reports">Informes</TabsTrigger>
                  <TabsTrigger value="invoices">Facturas</TabsTrigger>
                  <TabsTrigger value="activity">Actividad</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <OverviewTab 
                    clients={clients} 
                    reports={reports} 
                    trackSectionVisibility={trackSectionVisibility}
                    setActiveTab={setActiveTab}
                  />
                </TabsContent>

                <TabsContent value="clients">
                  <ClientsTab clients={clients} reports={reports} />
                </TabsContent>

                <TabsContent value="reports">
                  <ReportsTab reports={reports} />
                </TabsContent>

                <TabsContent value="invoices">
                  <AnimatedContainer animation="fade" delay={400}>
                    <InvoicesTab />
                  </AnimatedContainer>
                </TabsContent>

                <TabsContent value="activity">
                  <ActivityTab clients={clients} reports={reports} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
