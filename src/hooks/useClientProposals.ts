
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClientProposal } from '@/types/client.types';

export const useClientProposals = (clientId?: string) => {
  const [proposals, setProposals] = useState<ClientProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<ClientProposal | null>(null);
  const { toast } = useToast();

  const fetchProposals = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // If no clientId is provided, fetch all proposals
      const query = supabase.from('client_proposals').select('*');
      
      if (clientId) {
        query.eq('client_id', clientId);
      }
      
      query.order('created_at', { ascending: false });
      
      const { data, error } = await query;

      if (error) throw error;
      
      const typedProposals = data?.map(item => ({
        ...item,
        status: item.status as 'draft' | 'sent' | 'accepted' | 'rejected'
      })) || [];
      
      setProposals(typedProposals);
    } catch (error: any) {
      console.error('Error fetching proposals:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las propuestas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [clientId, toast]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // Clear editing state when dialog closes
  const handleSetDialogOpen = useCallback((isOpen: boolean) => {
    setDialogOpen(isOpen);
    if (!isOpen) {
      // Clear editing proposal when dialog closes
      setEditingProposal(null);
    }
  }, []);

  const handleCreateProposal = useCallback(() => {
    setEditingProposal(null);
    setDialogOpen(true);
  }, []);

  const handleEditProposal = useCallback((proposal: ClientProposal) => {
    setEditingProposal(proposal);
    setDialogOpen(true);
  }, []);

  const handleSaveProposal = useCallback(async (proposal: Partial<ClientProposal>) => {
    try {
      if (editingProposal) {
        // Update existing proposal
        const { error } = await supabase
          .from('client_proposals')
          .update({
            title: proposal.title,
            description: proposal.description,
            services: proposal.services,
            price: proposal.price,
            status: proposal.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProposal.id);

        if (error) throw error;

        // Update local state
        setProposals(proposals.map(p => 
          p.id === editingProposal.id ? { ...p, ...proposal, updated_at: new Date().toISOString() } as ClientProposal : p
        ));

        toast({
          title: 'Propuesta actualizada',
          description: 'La propuesta se actualizó correctamente',
        });
      } else if (clientId) {
        // Create new proposal
        const { data, error } = await supabase
          .from('client_proposals')
          .insert({
            client_id: clientId,
            title: proposal.title,
            description: proposal.description,
            services: proposal.services,
            price: proposal.price,
            status: proposal.status || 'draft',
          })
          .select();

        if (error) throw error;

        // Update local state
        if (data && data[0]) {
          const newProposal = {
            ...data[0],
            status: data[0].status as 'draft' | 'sent' | 'accepted' | 'rejected'
          };
          setProposals([newProposal, ...proposals]);
        }

        toast({
          title: 'Propuesta creada',
          description: 'La propuesta se creó correctamente',
        });
      }
      
      // Explicitly close dialog with a small delay to ensure proper state cleanup
      setTimeout(() => {
        setDialogOpen(false);
      }, 100);
    } catch (error: any) {
      console.error('Error saving proposal:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la propuesta',
        variant: 'destructive',
      });
    }
  }, [editingProposal, clientId, proposals, toast]);

  const handleDeleteProposal = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setProposals(proposals.filter(p => p.id !== id));

      toast({
        title: 'Propuesta eliminada',
        description: 'La propuesta se eliminó correctamente',
      });
    } catch (error: any) {
      console.error('Error deleting proposal:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la propuesta',
        variant: 'destructive',
      });
    }
  }, [proposals, toast]);

  return {
    proposals,
    isLoading,
    dialogOpen,
    editingProposal,
    setDialogOpen: handleSetDialogOpen,
    handleCreateProposal,
    handleEditProposal,
    handleSaveProposal,
    handleDeleteProposal,
    fetchProposals
  };
};
