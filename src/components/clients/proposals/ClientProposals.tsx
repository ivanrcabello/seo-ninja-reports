
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import ProposalCard from './ProposalCard';
import ProposalDialog from './ProposalDialog';
import { ClientProposal } from '@/types/client.types';

interface ClientProposalsProps {
  clientId: string;
}

const ClientProposals: React.FC<ClientProposalsProps> = ({ clientId }) => {
  const [proposals, setProposals] = useState<ClientProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<ClientProposal | null>(null);
  const { toast } = useToast();

  // Fetch proposals
  useEffect(() => {
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

    fetchProposals();
  }, [clientId, toast]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Propuestas</h2>
        <Button onClick={handleCreateProposal} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nueva Propuesta
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No hay propuestas</h3>
          <p className="text-muted-foreground mb-4">
            Crea tu primera propuesta para este cliente.
          </p>
          <Button onClick={handleCreateProposal} variant="default">
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear Propuesta
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onEdit={() => handleEditProposal(proposal)}
              onDelete={() => handleDeleteProposal(proposal.id)}
            />
          ))}
        </div>
      )}

      <ProposalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        proposal={editingProposal}
        onSave={handleSaveProposal}
      />
    </div>
  );
};

export default ClientProposals;
