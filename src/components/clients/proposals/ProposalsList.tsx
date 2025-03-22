
import React from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProposalCard from './ProposalCard';
import { ClientProposal } from '@/types/client.types';

interface ProposalsListProps {
  proposals: ClientProposal[];
  isLoading: boolean;
  onCreateProposal: () => void;
  onEditProposal: (proposal: ClientProposal) => void;
  onDeleteProposal: (id: string) => void;
}

const ProposalsList: React.FC<ProposalsListProps> = ({
  proposals,
  isLoading,
  onCreateProposal,
  onEditProposal,
  onDeleteProposal
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No hay propuestas</h3>
        <p className="text-muted-foreground mb-4">
          Crea tu primera propuesta para este cliente.
        </p>
        <Button onClick={onCreateProposal} variant="default">
          <PlusCircle className="h-4 w-4 mr-2" />
          Crear Propuesta
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          onEdit={() => onEditProposal(proposal)}
          onDelete={() => onDeleteProposal(proposal.id)}
        />
      ))}
    </div>
  );
};

export default ProposalsList;
