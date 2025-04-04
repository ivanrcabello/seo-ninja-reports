
import React from 'react';
import { PublicContract } from './types';

interface ContractHeaderProps {
  contract: PublicContract;
  logo: string | null;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({ contract, logo }) => {
  return (
    <header className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{contract.title}</h1>
          {contract.client_name && (
            <p className="text-muted-foreground">
              Contrato para: <span className="font-medium">{contract.client_name}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Fecha: {new Date(contract.created_at).toLocaleDateString()}
          </p>
        </div>
        
        {logo && (
          <div className="shrink-0">
            <img src={logo} alt="Logo" className="h-16 w-auto object-contain" />
          </div>
        )}
      </div>
    </header>
  );
};

export default ContractHeader;
