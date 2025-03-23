
import React, { useState, useEffect } from 'react';
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

  // Clean up state on component unmount
  useEffect(() => {
    return () => {
      setIsContractDialogOpen(false);
      setEditingContract(null);
      setViewingContract(null);
    };
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchContracts();
      toast.success('Contratos actualizados');
    } catch (error) {
      console.error('Error refreshing contracts:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateContract = () => {
    setEditingContract(null);
    setIsContractDialogOpen(true);
  };

  const handleEditContract = (contract: ClientContract) => {
    setEditingContract(contract);
    setIsContractDialogOpen(true);
  };

  const handleViewContract = (contract: ClientContract) => {
    setViewingContract(contract);
  };

  const handleDeleteContract = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contrato? Esta acción no se puede deshacer.')) {
      try {
        await deleteContract(id);
      } catch (error) {
        console.error('Error deleting contract:', error);
      }
    }
  };

  // Handler for closing the contract viewer
  const handleCloseViewer = () => {
    setViewingContract(null);
  };

  // Handler for closing the contract dialog
  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setIsContractDialogOpen(false);
      setEditingContract(null);
    } else {
      setIsContractDialogOpen(true);
    }
  };

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
      
      <ContractDialog
        clientId={clientId}
        clientName={clientName}
        open={isContractDialogOpen}
        onOpenChange={handleCloseDialog}
        editingContract={editingContract}
      />
      
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
