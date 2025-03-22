
import React from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContractsHeaderProps {
  onCreateContract: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const ContractsHeader: React.FC<ContractsHeaderProps> = ({
  onCreateContract,
  onRefresh,
  isRefreshing
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Contratos</h2>
        <p className="text-muted-foreground mt-1">
          Gestiona los contratos para este cliente
        </p>
      </div>
      
      <div className="flex space-x-2 self-end sm:self-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
        
        <Button onClick={onCreateContract} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Contrato
        </Button>
      </div>
    </div>
  );
};

export default ContractsHeader;
