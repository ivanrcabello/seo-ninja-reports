
import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  ContractHeader,
  ContractContent,
  ContactInfo,
  useContractData,
  useContractActions
} from '@/components/shared-contract';
import SignatureDialog from '@/components/clients/contracts/SignatureDialog';

const SharedContract = () => {
  const { id } = useParams<{ id: string }>();
  const { contract, setContract, loading, error, logo } = useContractData(id);
  const { 
    isSignDialogOpen, 
    setIsSignDialogOpen, 
    handleSignContract, 
    handlePrint 
  } = useContractActions(id, contract, setContract);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Contract Header */}
          <ContractHeader contract={contract} logo={logo} />
          
          {/* Contract Content */}
          <ContractContent 
            loading={loading} 
            error={error} 
            contract={contract} 
            onOpenSignDialog={() => setIsSignDialogOpen(true)} 
            onPrint={handlePrint}
            onSign={handleSignContract}
            isSignDialogOpen={isSignDialogOpen}
            setIsSignDialogOpen={setIsSignDialogOpen}
          />
          
          {/* Información de contacto */}
          <ContactInfo />
        </div>
      </div>
    </>
  );
};

export default SharedContract;
