
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

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { getClient, isLoading: clientsLoading, deleteClient } = useClients();
  const { getClientReports, isLoading: reportsLoading } = useReports();
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'proposals' | 'contracts' | 'invoices'>('overview');
  const [didMount, setDidMount] = useState(false);
  const isMounted = useRef(true);
  const previousPathRef = useRef('');

  // Set mount state and cleanup on unmount
  useEffect(() => {
    console.log("ClientDetail mounting");
    setDidMount(true);
    isMounted.current = true;
    previousPathRef.current = location.pathname;
    
    // Abortar cualquier solicitud de red pendiente al desmontar
    const controller = new AbortController();
    
    // Función mejorada para limpiar recursos y cerrar modales
    const cleanupResources = () => {
      // Force document body click to close any stuck modals or popovers
      document.body.click();
      
      // Find and click any open dialogs' close buttons
      const closeButtons = document.querySelectorAll('[data-state="open"] button[aria-label="Close"]');
      closeButtons.forEach(button => {
        if (button instanceof HTMLElement) {
          button.click();
        }
      });
      
      // Cerrar cualquier menú desplegable que pudiera estar abierto
      const dropdownMenus = document.querySelectorAll('[data-state="open"][data-radix-dropdown-menu-content]');
      dropdownMenus.forEach(menu => {
        if (menu.parentElement) {
          document.body.click(); // Esto suele cerrar menús desplegables
        }
      });
    };
    
    // Cleanup event listeners and state when component unmounts
    return () => {
      console.log("ClientDetail unmounting");
      setDidMount(false);
      isMounted.current = false;
      controller.abort();
      
      // Limpiar antes de desmontar
      cleanupResources();
      
      // Asegurarse de que los modales están cerrados incluso después de desmontar
      setTimeout(cleanupResources, 0);
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
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting client:', error);
    } finally {
      if (isMounted.current) {
        setIsDeleting(false);
      }
    }
  };

  // Handle tab changes with improved state handling
  const handleTabChange = useCallback((tab: 'overview' | 'reports' | 'proposals' | 'contracts' | 'invoices') => {
    // Only update if the component is still mounted
    if (isMounted.current && tab !== activeTab) {
      console.log(`Changing tab from ${activeTab} to ${tab}`);
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
    // Solo ejecutar si el componente está montado
    if (!isMounted.current) return;
    
    const handleHashChange = () => {
      if (!isMounted.current) return;
      
      try {
        const hash = window.location.hash.replace('#', '');
        
        if (hash === 'reports') {
          setActiveTab('reports');
        } else if (hash === 'proposals') {
          setActiveTab('proposals');
        } else if (hash === 'contracts') {
          setActiveTab('contracts');
        } else if (hash === 'invoices') {
          setActiveTab('invoices');
        } else if (!hash) {
          setActiveTab('overview');
        }
      } catch (error) {
        console.error('Error handling hash change:', error);
        // Default to overview tab if there's an error
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

  // Manejar eventos de navegación del navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("beforeunload event triggered");
      // Clean up any open modals before navigating away
      document.body.click();
    };
    
    const handlePopState = (event: PopStateEvent) => {
      console.log("popstate event triggered", event);
      // Limpiar modales y procesar el evento back/forward
      document.body.click();
      
      const closeButtons = document.querySelectorAll('[data-state="open"] button[aria-label="Close"]');
      closeButtons.forEach(button => {
        if (button instanceof HTMLElement) {
          button.click();
        }
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <Layout>
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
                key={`content-${id}-${activeTab}`} // Force re-render when tab or client changes
              />
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ClientDetail;
