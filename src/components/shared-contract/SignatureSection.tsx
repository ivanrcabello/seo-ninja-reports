
import React from 'react';
import { PublicContract } from './types';

interface SignatureSectionProps {
  contract: PublicContract;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ contract }) => {
  if (!contract.admin_signature && !contract.client_signature) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      <h4 className="text-sm font-medium mb-4">Firmas</h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contract.admin_signature && (
          <div className="border rounded-md p-4 bg-white dark:bg-muted">
            <div className="text-xs text-muted-foreground mb-2">Firma del Administrador</div>
            <div className="flex justify-center border-t pt-2">
              <img 
                src={contract.admin_signature} 
                alt="Firma del Administrador" 
                className="max-h-16 object-contain" 
              />
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              {contract.admin_signed_at 
                ? new Date(contract.admin_signed_at).toLocaleDateString('es-ES', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) 
                : 'Fecha no disponible'}
            </div>
          </div>
        )}
        
        {contract.client_signature && (
          <div className="border rounded-md p-4 bg-white dark:bg-muted">
            <div className="text-xs text-muted-foreground mb-2">Firma del Cliente</div>
            <div className="flex justify-center border-t pt-2">
              <img 
                src={contract.client_signature} 
                alt="Firma del Cliente" 
                className="max-h-16 object-contain" 
              />
            </div>
            <div className="text-xs text-center text-muted-foreground mt-2">
              {contract.client_signed_at 
                ? new Date(contract.client_signed_at).toLocaleDateString('es-ES', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) 
                : 'Fecha no disponible'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureSection;
