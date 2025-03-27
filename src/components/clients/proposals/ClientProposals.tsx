
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useClientProposals } from '@/hooks/useClientProposals';
import { ClientProposal } from '@/types/client.types';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import ProposalsList from './ProposalsList';
import ProposalDialog from './ProposalDialog';
import ProposalsHeader from './ProposalsHeader';

interface ClientProposalsProps {
  clientId: string;
  clientName?: string;
}

const ClientProposals: React.FC<ClientProposalsProps> = ({ clientId, clientName }) => {
  const { 
    proposals, 
    isLoading, 
    dialogOpen, 
    setDialogOpen, 
    handleCreateProposal,
    handleEditProposal,
    handleSaveProposal,
    handleDeleteProposal,
    fetchProposals
  } = useClientProposals(clientId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMounted = useRef(true);

  console.log("ClientProposals rendered with clientId:", clientId);
  console.log("Proposals data:", proposals);

  // Set up the mounted ref and clean up on unmount
  useEffect(() => {
    isMounted.current = true;
    
    // Initial data fetch
    const loadData = async () => {
      try {
        console.log("Fetching proposals for clientId:", clientId);
        await fetchProposals();
      } catch (error) {
        console.error('Error loading proposals:', error);
      }
    };
    
    loadData();
    
    return () => {
      console.log("ClientProposals unmounting");
      isMounted.current = false;
    };
  }, [clientId, fetchProposals]);

  // Handle browser back button with popstate event
  useEffect(() => {
    const handlePopState = () => {
      if (isMounted.current) {
        console.log("Popstate event detected, resetting dialog states");
        setDialogOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setDialogOpen]);

  const handleRefresh = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      setIsRefreshing(true);
      console.log("Manually refreshing proposals for clientId:", clientId);
      await fetchProposals();
      if (isMounted.current) {
        toast.success('Propuestas actualizadas');
      }
    } catch (error) {
      console.error('Error refreshing proposals:', error);
    } finally {
      if (isMounted.current) {
        setIsRefreshing(false);
      }
    }
  }, [clientId, fetchProposals]);

  if (isLoading && proposals.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[200px]">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Propuestas</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button size="sm" onClick={handleCreateProposal}>
            Nueva Propuesta
          </Button>
        </div>
      </div>
      
      <ProposalsList
        proposals={proposals}
        isLoading={isLoading}
        onCreateProposal={handleCreateProposal}
        onEditProposal={handleEditProposal}
        onDeleteProposal={handleDeleteProposal}
      />

      <ProposalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        proposal={null}
        onSave={handleSaveProposal}
      />
    </div>
  );
};

export default ClientProposals;
