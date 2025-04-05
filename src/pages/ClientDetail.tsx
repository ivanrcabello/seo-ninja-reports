
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import ClientHeader from '@/components/clients/ClientHeader';
import ClientDetailContent from '@/components/clients/ClientDetailContent';
import ClientLoadingState from '@/components/clients/ClientLoadingState';
import ClientNotFound from '@/components/clients/ClientNotFound';
import { useAuth } from '@/context/AuthContext';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import BackButton from '@/components/navigation/BackButton';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { getClient, isLoading: clientsLoading, deleteClient } = useClients();
  const { getClientReports, isLoading: reportsLoading } = useReports();
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const isMounted = useRef(true);

  // Set mount state and cleanup on unmount
  useEffect(() => {
    console.log("ClientDetail mounting");
    isMounted.current = true;
    
    // Clean up resources on unmount
    return () => {
      console.log("ClientDetail unmounting");
      isMounted.current = false;
    };
  }, []);

  // Handle URL hash for direct tab navigation
  useEffect(() => {
    if (!isMounted.current) return;
    
    const handleHashChange = () => {
      if (!isMounted.current) return;
      
      try {
        const hash = window.location.hash.replace('#', '');
        
        if (['reports', 'proposals', 'contracts', 'invoices'].includes(hash)) {
          setActiveTab(hash);
        } else if (!hash) {
          setActiveTab('overview');
        }
      } catch (error) {
        console.error('Error handling hash change:', error);
        if (isMounted.current) {
          setActiveTab('overview');
        }
      }
    };
    
    // Check on mount and location changes
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location]);

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
      console.log('Starting client deletion process for ID:', client.id);
      await deleteClient(client.id);
      console.log('Client deletion completed successfully');
      
      toast.success('Cliente eliminado exitosamente');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Error in handleDeleteClient:', error);
      toast.error(error.message || 'Error al eliminar el cliente');
      
      if (isMounted.current) {
        setIsDeleting(false);
      }
    }
  };

  // Handle tab changes with improved navigation
  const handleTabChange = useCallback((tab: string) => {
    if (isMounted.current && tab !== activeTab) {
      console.log(`Changing tab from ${activeTab} to ${tab}`);
      setActiveTab(tab);
      
      // Update URL hash without triggering full page reload
      const newUrl = tab === 'overview' 
        ? `${window.location.pathname}` 
        : `${window.location.pathname}#${tab}`;
      
      window.history.pushState({ tab }, '', newUrl);
    }
  }, [activeTab]);

  // Create breadcrumb items
  const breadcrumbItems = client ? [
    { label: 'Inicio', href: '/' },
    { label: 'Panel de Control', href: '/dashboard' },
    { label: 'Clientes', href: '/dashboard#clients' },
    { label: client.name }
  ] : [];

  return (
    <Layout>
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          {!isLoading && client && (
            <div className="mb-6">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="mt-4">
                <BackButton />
              </div>
            </div>
          )}
          
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
              />
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ClientDetail;
