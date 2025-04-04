
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, PenLine } from 'lucide-react';
import { PublicContract } from './types';

interface ContractActionsProps {
  contract: PublicContract;
  onOpenSignDialog: () => void;
  onPrint: () => void;
}

const ContractActions: React.FC<ContractActionsProps> = ({
  contract,
  onOpenSignDialog,
  onPrint
}) => {
  const canSign = (
    contract.status !== 'signed' && 
    contract.status !== 'expired' && 
    contract.status !== 'cancelled' && 
    !contract.client_signed
  );
  
  return (
    <div className="flex flex-col gap-3">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPrint}
        className="w-full flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Imprimir contrato
      </Button>
      
      {canSign && (
        <Button 
          size="sm" 
          onClick={onOpenSignDialog}
          className="w-full flex items-center gap-2"
        >
          <PenLine className="h-4 w-4" />
          Firmar contrato
        </Button>
      )}
    </div>
  );
};

export default ContractActions;
