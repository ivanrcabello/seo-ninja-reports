
import React from 'react';
import { Loader2 } from 'lucide-react';
import { SignatureSection } from './';
import { PublicContract } from './types';
import { ContractActions } from './';

interface ContractContentProps {
  loading: boolean;
  error: string | null;
  contract: PublicContract | null;
  onOpenSignDialog: () => void;
  onPrint: () => void;
}

const ContractContent: React.FC<ContractContentProps> = ({
  loading,
  error,
  contract,
  onOpenSignDialog,
  onPrint
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-lg my-8">
        <h2 className="text-lg font-medium mb-2">Error</h2>
        <p>{error || "No se pudo cargar el contrato"}</p>
      </div>
    );
  }

  return (
    <div className="my-8">
      {/* Contract document */}
      <div className="bg-white shadow-md rounded-lg p-8 mb-6">
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contract.content }} />
      </div>
      
      {/* Signature section */}
      <SignatureSection 
        contract={contract}
        onOpenSignDialog={onOpenSignDialog}
        onPrint={onPrint}
      />
      
      {/* Contract Actions for mobile display */}
      <div className="mt-6 md:hidden">
        <ContractActions 
          contract={contract}
          onOpenSignDialog={onOpenSignDialog}
          onPrint={onPrint}
        />
      </div>
    </div>
  );
};

export default ContractContent;
