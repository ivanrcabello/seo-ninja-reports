
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer, Pencil } from 'lucide-react';
import { SharedContract } from '@/types/shared-content';

interface ContractActionsProps {
  contract: SharedContract;
  onOpenSignDialog: () => void;
  onPrint: () => void;
}

const ContractActions: React.FC<ContractActionsProps> = ({
  contract,
  onOpenSignDialog,
  onPrint
}) => {
  const canSign = !contract.client_signed && 
    contract.status !== 'cancelled' && 
    contract.status !== 'expired';

  return (
    <div className="flex flex-col space-y-2">
      {canSign && (
        <Button 
          onClick={onOpenSignDialog}
          className="flex items-center justify-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Firmar contrato
        </Button>
      )}
      
      <Button 
        variant="outline"
        onClick={onPrint}
        className="flex items-center justify-center gap-2"
      >
        <Printer className="h-4 w-4" />
        Imprimir contrato
      </Button>
      
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2"
        asChild
      >
        <a href="#" onClick={(e) => {
          e.preventDefault();
          onPrint();
        }}>
          <Download className="h-4 w-4" />
          Descargar contrato
        </a>
      </Button>
    </div>
  );
};

export default ContractActions;
