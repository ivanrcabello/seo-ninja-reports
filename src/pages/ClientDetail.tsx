
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientHeader from '@/components/clients/ClientHeader';
import ClientDetailContent from '@/components/clients/ClientDetailContent';
import ClientLoadingState from '@/components/clients/ClientLoadingState';
import ClientNotFound from '@/components/clients/ClientNotFound';
import { useAuth } from '@/context/AuthContext';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const { getClient, isLoading: clientsLoading, deleteClient } = useClients();
  const { getClientReports, isLoading: reportsLoading } = useReports();
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'new-report' | 'proposals' | 'contracts'>('overview');
  const [didMount, setDidMount] = useState(false);
  const prevTabRef = useRef<string | null>(null);

  // Set mount state
  useEffect(() => {
    setDidMount(true);
    return () => {
      setDidMount(false);
    };
  }, []);

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  if (!id) {
    return <Navigate to="/dashboard" replace />;
  }

  const client = getClient(id);
  const reports = getClientReports(id);
  const isLoading = authLoading || clientsLoading || reportsLoading;

  const handleDeleteClient = async () => {
    if (!client) return;
    
    setIsDeleting(true);
    try {
      await deleteClient(client.id);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle tab changes with improved state handling
  const handleTabChange = useCallback((tab: 'overview' | 'reports' | 'new-report' | 'proposals' | 'contracts') => {
    // Only update if the tab is actually changing
    if (tab !== activeTab) {
      prevTabRef.current = activeTab;
      setActiveTab(tab);
      
      // Update URL hash without triggering full page reload
      if (didMount) {
        const newUrl = tab === 'overview' 
          ? `${window.location.pathname}` 
          : `${window.location.pathname}#${tab}`;
        
        window.history.pushState({ tab }, '', newUrl);
      }
    }
  }, [didMount, activeTab]);

  // Handle anchor navigation to tabs (for direct links) with improved error handling
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.replace('#', '');
        
        if (hash === 'reports') {
          setActiveTab('reports');
        } else if (hash === 'new-report') {
          setActiveTab('new-report');
        } else if (hash === 'proposals') {
          setActiveTab('proposals');
        } else if (hash === 'contracts') {
          setActiveTab('contracts');
        } else if (!hash) {
          setActiveTab('overview');
        }
      } catch (error) {
        console.error('Error handling hash change:', error);
        // Default to overview tab if there's an error
        setActiveTab('overview');
      }
    };
    
    // Check on mount and location changes
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {isLoading ? (
            <ClientLoadingState />
          ) : !client ? (
            <ClientNotFound />
          ) : (
            <>
              <ClientHeader 
                client={client} 
                isDeleting={isDeleting} 
                onDeleteClient={handleDeleteClient} 
              />
              
              <ClientDetailContent 
                client={client}
                reports={reports}
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                clientId={id}
                key={`content-${activeTab}`} // Force re-render when tab changes
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientDetail;
