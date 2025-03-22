
import React from 'react';
import { Loader2, PlusCircle, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProposalCard from './ProposalCard';
import { ClientProposal } from '@/types/client.types';
import { AnimatePresence, motion } from 'framer-motion';

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
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/50 rounded-lg p-8 text-center"
      >
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
          <ScrollText className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">No hay propuestas</h3>
        <p className="text-muted-foreground mb-4">
          Crea tu primera propuesta para este cliente.
        </p>
        <Button onClick={onCreateProposal} variant="default">
          <PlusCircle className="h-4 w-4 mr-2" />
          Crear Propuesta
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proposals.map((proposal, index) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProposalCard
              proposal={proposal}
              onEdit={() => onEditProposal(proposal)}
              onDelete={() => onDeleteProposal(proposal.id)}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default ProposalsList;
