
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClientProposal } from '@/types/client.types';

export const useClientProposals = (clientId: string) => {
  const [proposals, setProposals] = useState<ClientProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<ClientProposal | null>(null);
  const { toast } = useToast();

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('client_proposals')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

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
  };

  useEffect(() => {
    if (clientId) {
      fetchProposals();
    }
  }, [clientId]);

  const handleCreateProposal = () => {
    setEditingProposal(null);
    setDialogOpen(true);
  };

  const handleEditProposal = (proposal: ClientProposal) => {
    setEditingProposal(proposal);
    setDialogOpen(true);
  };

  const handleSaveProposal = async (proposal: Partial<ClientProposal>) => {
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
      } else {
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
      
      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving proposal:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la propuesta',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProposal = async (id: string) => {
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
  };

  return {
    proposals,
    isLoading,
    dialogOpen,
    editingProposal,
    setDialogOpen,
    handleCreateProposal,
    handleEditProposal,
    handleSaveProposal,
    handleDeleteProposal
  };
};
