
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useClientInvoices } from '@/hooks/useClientInvoices';
import { ClientInvoice } from '@/types/client.types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import InvoicesList from './InvoicesList';
import InvoiceDialog from './InvoiceDialog';
import InvoicesHeader from './InvoicesHeader';
import InvoiceViewer from './InvoiceViewer';

interface ClientInvoicesProps {
  clientId: string;
  clientName?: string;
}

const ClientInvoices: React.FC<ClientInvoicesProps> = ({ clientId, clientName }) => {
  const { invoices, isLoading, error, fetchInvoices, deleteInvoice } = useClientInvoices(clientId);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<ClientInvoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<ClientInvoice | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMounted = useRef(true);

  console.log("ClientInvoices rendered with clientId:", clientId);
  console.log("Invoices data:", invoices);

  // Set up the mounted ref and clean up on unmount
  useEffect(() => {
    isMounted.current = true;
    
    // Initial data fetch
    const loadData = async () => {
      try {
        console.log("Fetching invoices for clientId:", clientId);
        await fetchInvoices();
      } catch (error) {
        console.error('Error loading invoices:', error);
      }
    };
    
    loadData();
    
    return () => {
      console.log("ClientInvoices unmounting");
      isMounted.current = false;
      // Reset all state when unmounting to prevent state persistence issues
      setIsInvoiceDialogOpen(false);
      setEditingInvoice(null);
      setViewingInvoice(null);
    };
  }, [clientId, fetchInvoices]);

  // Handle browser back button with popstate event
  useEffect(() => {
    const handlePopState = () => {
      if (isMounted.current) {
        console.log("Popstate event detected, resetting dialog states");
        setIsInvoiceDialogOpen(false);
        setEditingInvoice(null);
        setViewingInvoice(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleRefresh = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setIsRefreshing(true);
      console.log("Manually refreshing invoices for clientId:", clientId);
      await fetchInvoices();
      if (isMounted.current) {
        toast.success('Facturas actualizadas');
      }
    } catch (error) {
      console.error('Error refreshing invoices:', error);
    } finally {
      if (isMounted.current) {
        setIsRefreshing(false);
      }
    }
  }, [clientId, fetchInvoices]);

  const handleCreateInvoice = useCallback(() => {
    if (!isMounted.current) return;
    setEditingInvoice(null);
    setIsInvoiceDialogOpen(true);
  }, []);

  const handleEditInvoice = useCallback((invoice: ClientInvoice) => {
    if (!isMounted.current) return;
    setEditingInvoice(invoice);
    setIsInvoiceDialogOpen(true);
  }, []);

  const handleViewInvoice = useCallback((invoice: ClientInvoice) => {
    if (!isMounted.current) return;
    setViewingInvoice(invoice);
  }, []);

  const handleDeleteInvoice = useCallback(async (id: string) => {
    if (!isMounted.current) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta factura? Esta acción no se puede deshacer.')) {
      try {
        await deleteInvoice(id);
        // After deletion, refresh the invoices list
        handleRefresh();
      } catch (error) {
        console.error('Error deleting invoice:', error);
      }
    }
  }, [deleteInvoice, handleRefresh]);

  // Handler for closing the invoice viewer
  const handleCloseViewer = useCallback(() => {
    if (!isMounted.current) return;
    console.log("Closing invoice viewer");
    setViewingInvoice(null);
  }, []);

  // Handler for closing the invoice dialog
  const handleCloseDialog = useCallback((open: boolean) => {
    if (!isMounted.current) return;
    console.log("Invoice dialog open state changed to:", open);
    setIsInvoiceDialogOpen(open);
    if (!open) {
      setEditingInvoice(null);
      // Refresh invoices list when dialog closes
      handleRefresh();
    }
  }, [handleRefresh]);

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-md text-center">
        <p className="text-destructive font-medium">Error: {error}</p>
        <Button variant="outline" className="mt-4" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InvoicesHeader
        onCreateInvoice={handleCreateInvoice}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <InvoicesList
        invoices={invoices || []}
        isLoading={isLoading}
        onCreateInvoice={handleCreateInvoice}
        onEditInvoice={handleEditInvoice}
        onDeleteInvoice={handleDeleteInvoice}
        onViewInvoice={handleViewInvoice}
      />
      
      {isInvoiceDialogOpen && (
        <InvoiceDialog
          clientId={clientId}
          clientName={clientName}
          open={isInvoiceDialogOpen}
          onOpenChange={handleCloseDialog}
          editingInvoice={editingInvoice}
        />
      )}
      
      {viewingInvoice && (
        <InvoiceViewer
          invoice={viewingInvoice}
          open={!!viewingInvoice}
          onOpenChange={handleCloseViewer}
          clientName={clientName}
        />
      )}
    </div>
  );
};

export default ClientInvoices;
