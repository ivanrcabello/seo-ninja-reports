
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import useClients from '@/hooks/useClients';
import { Loader2 } from 'lucide-react';
import usePersistentState from '@/hooks/usePersistentState';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/dashboard/DashboardTabs';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { clients, isLoading: clientsLoading } = useClients();
  const [lastVisitedSection, setLastVisitedSection] = usePersistentState<string>('dashboard-section', '');
  const [activeTab, setActiveTab] = useState('overview');
  const [nextEvents, setNextEvents] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const currentDate = new Date();

  // Redirect if not authenticated
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const isLoading = authLoading || clientsLoading;

  useEffect(() => {
    const handleVisibilityChange = () => {
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

  // Setup sample data for dashboard when loading completes
  useEffect(() => {
    if (!isLoading) {
      setNextEvents([
        {
          title: 'Reunión mensual de estrategia',
          date: new Date(new Date().setDate(new Date().getDate() + 3)),
          type: 'meeting'
        },
        {
          title: 'Entrega informe SEO Técnico',
          date: new Date(new Date().setDate(new Date().getDate() + 7)),
          type: 'deadline',
          clientId: clients.length > 0 ? clients[0].id : null
        },
        {
          title: 'Revisión de keywords',
          date: new Date(new Date().setDate(new Date().getDate() + 10)),
          type: 'task'
        }
      ]);

      const today = new Date();
      
      setUpcomingDeadlines([
        {
          title: 'Renovación contrato mensual',
          client: clients.length > 0 ? clients[0].name : 'Cliente',
          dueDate: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 15),
          type: 'contract'
        },
        {
          title: 'Factura mensual pendiente',
          client: clients.length > 1 ? clients[1].name : 'Cliente',
          dueDate: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 10),
          type: 'invoice'
        }
      ]);
    }
  }, [isLoading, clients]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              <DashboardHeader 
                currentDate={currentDate}
                nextEvents={nextEvents}
                upcomingDeadlines={upcomingDeadlines}
              />
              
              <DashboardTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                clients={clients}
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
