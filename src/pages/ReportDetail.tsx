
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import useClients from '@/hooks/useClients';
import useReports from '@/hooks/useReports';
import ReportDetailContent from '@/components/reports/detail/ReportDetailContent';
import usePersistentState from '@/hooks/usePersistentState';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import CrawlerDetail from '@/components/clients/seo-crawler/CrawlerDetail';

const ReportDetail = () => {
  const { id, clientId, crawlId } = useParams<{ id: string; clientId: string; crawlId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialIsEditing = searchParams.get('mode') === 'edit';
  const isMounted = useRef(true);
  const navigatingBackRef = useRef(false);
  
  // Use persistent state to maintain editing state across tab changes
  const [isEditing, setIsEditing] = usePersistentState<boolean>(
    `report-edit-state-${id}`, 
    initialIsEditing
  );
  
  const { user, loading: authLoading } = useAuth();
  const { getClient } = useClients();
  const { getReport, isLoading: reportsLoading, deleteReport } = useReports();
  
  // Set up mounting and cleanup
  useEffect(() => {
    console.log("ReportDetail mounting");
    isMounted.current = true;
    
    // Función mejorada para limpiar recursos y cerrar modales
    const cleanupResources = () => {
      console.log("Cleaning up resources in ReportDetail");
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
      
      // Eliminar cualquier overlay que pudiera haber quedado
      const overlays = document.querySelectorAll('[id="navigation-overlay"]');
      overlays.forEach(overlay => {
        if (overlay.parentElement) {
          overlay.parentElement.removeChild(overlay);
        }
      });
      
      // Asegurarse de que no haya overlays o modales abiertos
      document.querySelectorAll('[role="dialog"]').forEach(dialog => {
        if (dialog.parentElement && dialog.parentElement.parentElement) {
          const backdrop = dialog.parentElement.parentElement;
          if (backdrop.parentElement) {
            backdrop.parentElement.removeChild(backdrop);
          }
        }
      });
    };
    
    return () => {
      console.log("ReportDetail unmounting");
      isMounted.current = false;
      
      // Limpiar antes de desmontar
      cleanupResources();
      
      // Asegurarse de que los modales están cerrados incluso después de desmontar
      setTimeout(cleanupResources, 0);
    };
  }, []);
  
  // Update URL when editing state changes
  useEffect(() => {
    if (!isMounted.current) return;
    
    const params = new URLSearchParams(location.search);
    if (isEditing) {
      params.set('mode', 'edit');
    } else {
      params.delete('mode');
    }
    
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true });
  }, [isEditing, location.pathname, navigate]);
  
  // Additional visibility change handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isMounted.current) return;
      
      if (document.visibilityState === 'visible') {
        // When coming back to the tab, check if we need to restore state
        const storedEditingState = sessionStorage.getItem(`report-edit-state-${id}`);
        if (storedEditingState) {
          try {
            const parsedState = JSON.parse(storedEditingState);
            if (parsedState !== isEditing && isMounted.current) {
              setIsEditing(parsedState);
            }
          } catch (e) {
            console.error("Error parsing stored state:", e);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, isEditing, setIsEditing]);
  
  // Mejorar manejo de eventos de navegación del navegador
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("beforeunload event triggered in ReportDetail");
      // Clean up any open modals before navigating away
      document.body.click();
    };
    
    const handlePopState = (event: PopStateEvent) => {
      console.log("popstate event triggered in ReportDetail", event);
      navigatingBackRef.current = true;
      
      // Limpiar modales antes de navegar
      document.body.click();
      
      // Cerrar cualquier diálogo abierto
      const closeButtons = document.querySelectorAll('[data-state="open"] button[aria-label="Close"]');
      closeButtons.forEach(button => {
        if (button instanceof HTMLElement) {
          button.click();
        }
      });
      
      // Prevenir interacción mientras se procesa la navegación
      const overlay = document.createElement('div');
      overlay.id = 'navigation-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'transparent';
      overlay.style.zIndex = '9999';
      document.body.appendChild(overlay);
      
      // Eliminar overlay después de navegar
      setTimeout(() => {
        if (document.getElementById('navigation-overlay')) {
          document.body.removeChild(overlay);
        }
        navigatingBackRef.current = false;
      }, 500);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  // Handle Crawler Detail Page
  if (clientId && crawlId) {
    return (
      <Layout>
        <main className="flex-1 pt-24 pb-16">
          <div className="container px-4 sm:px-6 mx-auto">
            <CrawlerDetail />
          </div>
        </main>
      </Layout>
    );
  }

  if (!id) {
    return <Navigate to="/dashboard" replace />;
  }

  const report = getReport(id);
  const isLoading = authLoading || reportsLoading;
  const client = report ? getClient(report.clientId) : null;

  const handleDeleteReport = async () => {
    if (!report) return;
    
    try {
      await deleteReport(report.id);
      if (isMounted.current) {
        toast.success('Informe eliminado correctamente');
        setTimeout(() => {
          window.location.href = client ? `/clients/${client.id}` : '/dashboard';
        }, 300);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error('Error al eliminar el informe');
    }
  };

  return (
    <Layout>
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <ReportDetailContent
            report={report}
            client={client}
            isLoading={isLoading}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleDeleteReport={handleDeleteReport}
          />
        </div>
      </main>
    </Layout>
  );
};

export default ReportDetail;
