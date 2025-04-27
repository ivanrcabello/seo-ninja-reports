
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useClientContracts } from '@/hooks/useClientContracts';
import { ClientContract } from '@/types/client.types';
import { Button } from '@/components/ui/button';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import ContractsList from './ContractsList';
import ContractDialog from './ContractDialog';
import ContractsHeader from './ContractsHeader';
import ContractViewer from './ContractViewer';

interface ClientContractsProps {
  clientId: string;
  clientName?: string;
}

const ClientContracts: React.FC<ClientContractsProps> = ({ clientId, clientName }) => {
  // Hooks y estados
  const { contracts, isLoading, error, fetchContracts, deleteContract } = useClientContracts(clientId);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ClientContract | null>(null);
  const [viewingContract, setViewingContract] = useState<ClientContract | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMounted = useRef(true);

  // Mejorar el seguimiento del ciclo de vida del componente
  useEffect(() => {
    console.log("ClientContracts mounted with clientId:", clientId);
    isMounted.current = true;
    
    // Function to load data initially
    const loadInitialData = async () => {
      if (!clientId) return;
      
      console.log("Loading contracts for client:", clientId);
      try {
        await fetchContracts();
      } catch (error) {
        console.error("Error loading contracts:", error);
      }
    };
    
    loadInitialData();
    
    // Cleanup on unmount
    return () => {
      console.log("ClientContracts unmounting");
      isMounted.current = false;
    };
  }, [clientId, fetchContracts]);

  // Manejar el botón de retroceso del navegador
  useEffect(() => {
    const handlePopState = () => {
      if (isMounted.current) {
        console.log("Popstate event detected, resetting dialog states");
        setIsContractDialogOpen(false);
        setEditingContract(null);
        setViewingContract(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handlers with mounted component check
  const handleRefresh = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setIsRefreshing(true);
      console.log("Manually refreshing contracts for client:", clientId);
      await fetchContracts();
      
      if (isMounted.current) {
        toast.success('Contratos actualizados');
      }
    } catch (error) {
      console.error('Error refreshing contracts:', error);
    } finally {
      if (isMounted.current) {
        setIsRefreshing(false);
      }
    }
  }, [clientId, fetchContracts]);

  const handleCreateContract = useCallback(() => {
    if (!isMounted.current) return;
    setEditingContract(null);
    setIsContractDialogOpen(true);
  }, []);

  const handleEditContract = useCallback((contract: ClientContract) => {
    if (!isMounted.current) return;
    setEditingContract(contract);
    setIsContractDialogOpen(true);
  }, []);

  const handleViewContract = useCallback((contract: ClientContract) => {
    if (!isMounted.current) return;
    console.log("Opening contract viewer for:", contract.id);
    setViewingContract(contract);
  }, []);

  const handleDeleteContract = useCallback(async (id: string) => {
    if (!isMounted.current) return;
    
    try {
      const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este contrato? Esta acción no se puede deshacer.');
      if (confirmed) {
        await deleteContract(id);
        if (isMounted.current) {
          toast.success('Contrato eliminado con éxito');
          await handleRefresh();
        }
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      if (isMounted.current) {
        toast.error('Error al eliminar el contrato');
      }
    }
  }, [deleteContract, handleRefresh]);

  // Handle contract viewer close
  const handleCloseViewer = useCallback(() => {
    if (!isMounted.current) return;
    console.log("Closing contract viewer");
    setViewingContract(null);
  }, []);

  // Handle contract dialog close
  const handleCloseDialog = useCallback((open: boolean) => {
    if (!isMounted.current) return;
    
    if (!open) {
      setIsContractDialogOpen(false);
      setEditingContract(null);
      
      // Refresh contracts list after dialog closes
      setTimeout(() => {
        if (isMounted.current) {
          handleRefresh();
        }
      }, 100);
    } else {
      setIsContractDialogOpen(true);
    }
  }, [handleRefresh]);

  // Error handling
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
      <ContractsHeader
        onCreateContract={handleCreateContract}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <ContractsList
        contracts={contracts || []}
        isLoading={isLoading}
        onCreateContract={handleCreateContract}
        onEditContract={handleEditContract}
        onDeleteContract={handleDeleteContract}
        onViewContract={handleViewContract}
      />
      
      {isContractDialogOpen && (
        <ContractDialog
          clientId={clientId}
          clientName={clientName}
          open={isContractDialogOpen}
          onOpenChange={handleCloseDialog}
          editingContract={editingContract}
        />
      )}
      
      {viewingContract && (
        <ContractViewer
          contract={viewingContract}
          open={!!viewingContract}
          onOpenChange={handleCloseViewer}
        />
      )}
    </div>
  );
};

export default ClientContracts;
