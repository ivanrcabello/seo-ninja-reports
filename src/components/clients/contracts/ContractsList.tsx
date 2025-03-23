
import React from 'react';
import { Loader2, PlusCircle, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ContractCard from './ContractCard';
import { ClientContract } from '@/types/client.types';
import { AnimatePresence, motion } from 'framer-motion';

interface ContractsListProps {
  contracts: ClientContract[];
  isLoading: boolean;
  onCreateContract: () => void;
  onEditContract: (contract: ClientContract) => void;
  onDeleteContract: (id: string) => void;
  onViewContract: (contract: ClientContract) => void;
}

const ContractsList: React.FC<ContractsListProps> = ({
  contracts,
  isLoading,
  onCreateContract,
  onEditContract,
  onDeleteContract,
  onViewContract
}) => {
  console.log("ContractsList rendering with contracts:", contracts);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contracts || contracts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/50 rounded-lg p-8 text-center"
      >
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
          <ScrollText className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">No hay contratos</h3>
        <p className="text-muted-foreground mb-4">
          Crea tu primer contrato para este cliente.
        </p>
        <Button onClick={onCreateContract} variant="default">
          <PlusCircle className="h-4 w-4 mr-2" />
          Crear Contrato
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ContractCard
              contract={contract}
              onEdit={() => onEditContract(contract)}
              onDelete={() => onDeleteContract(contract.id)}
              onView={() => onViewContract(contract)}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default ContractsList;
