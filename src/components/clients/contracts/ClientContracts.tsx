
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
  const { contracts, isLoading, error, fetchContracts, deleteContract } = useClientContracts(clientId);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ClientContract | null>(null);
  const [viewingContract, setViewingContract] = useState<ClientContract | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMounted = useRef(true);

  // Set up the mounted ref
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Clean up state on component unmount or when clientId changes
  useEffect(() => {
    const cleanup = () => {
      if (isMounted.current) {
        setIsContractDialogOpen(false);
        setEditingContract(null);
        setViewingContract(null);
      }
    };
    
    // Initial data fetch
    const loadData = async () => {
      try {
        await fetchContracts();
      } catch (error) {
        console.error('Error loading contracts:', error);
      }
    };
    
    loadData();
    
    return cleanup;
  }, [clientId, fetchContracts]);

  // Handle browser back button with popstate event
  useEffect(() => {
    const handlePopState = () => {
      if (isMounted.current) {
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

  const handleRefresh = async () => {
    if (!isMounted.current) return;
    
    try {
      setIsRefreshing(true);
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
  };

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
    setViewingContract(contract);
  }, []);

  const handleDeleteContract = useCallback(async (id: string) => {
    if (!isMounted.current) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este contrato? Esta acción no se puede deshacer.')) {
      try {
        await deleteContract(id);
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  }, [deleteContract]);

  // Handler for closing the contract viewer
  const handleCloseViewer = useCallback(() => {
    if (!isMounted.current) return;
    setViewingContract(null);
  }, []);

  // Handler for closing the contract dialog
  const handleCloseDialog = useCallback((open: boolean) => {
    if (!isMounted.current) return;
    setIsContractDialogOpen(open);
    if (!open) {
      setEditingContract(null);
    }
  }, []);

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
        contracts={contracts}
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
