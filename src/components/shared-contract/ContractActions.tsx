
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Download } from 'lucide-react';
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
  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-4">
      {/* Botón para firmar si el cliente aún no ha firmado */}
      {!contract.client_signed && contract.status !== 'cancelled' && contract.status !== 'expired' && (
        <Button 
          onClick={onOpenSignDialog}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Firmar como Cliente
        </Button>
      )}
      
      {/* Botón para descargar/imprimir siempre visible */}
      <Button 
        variant="outline" 
        onClick={onPrint}
        className="w-full sm:w-auto"
      >
        <Download className="h-4 w-4 mr-2" />
        Imprimir / Guardar PDF
      </Button>
    </div>
  );
};

export default ContractActions;
