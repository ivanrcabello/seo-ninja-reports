
import React from 'react';
import ProposalDialog from './ProposalDialog';
import ProposalsHeader from './ProposalsHeader';
import ProposalsList from './ProposalsList';
import { useClientProposals } from '@/hooks/useClientProposals';

interface ClientProposalsProps {
  clientId: string;
}

const ClientProposals: React.FC<ClientProposalsProps> = ({ clientId }) => {
  const {
    proposals,
    isLoading,
    dialogOpen,
    editingProposal,
    setDialogOpen,
    handleCreateProposal,
    handleEditProposal,
    handleSaveProposal,
    handleDeleteProposal
  } = useClientProposals(clientId);

  return (
    <div className="space-y-6">
      <ProposalsHeader onCreateProposal={handleCreateProposal} />

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
        proposal={editingProposal}
        onSave={handleSaveProposal}
      />
    </div>
  );
};

export default ClientProposals;
