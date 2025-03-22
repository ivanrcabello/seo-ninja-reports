
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface ProposalsHeaderProps {
  onCreateProposal: () => void;
}

const ProposalsHeader: React.FC<ProposalsHeaderProps> = ({ onCreateProposal }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Propuestas</h2>
      <Button onClick={onCreateProposal} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Nueva Propuesta
      </Button>
    </div>
  );
};

export default ProposalsHeader;
