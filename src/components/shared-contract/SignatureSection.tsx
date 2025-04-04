
import React from 'react';
import { Button } from '@/components/ui/button';
import { PublicContract } from './types';
import { PenLine, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import SignatureDialog from '@/components/clients/contracts/SignatureDialog';

interface SignatureSectionProps {
  contract: PublicContract;
  onOpenSignDialog: () => void;
  onPrint: () => void;
  onSign: (signature: string) => void;
  isSignDialogOpen: boolean;
  setIsSignDialogOpen: (open: boolean) => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({
  contract,
  onOpenSignDialog,
  onSign,
  isSignDialogOpen,
  setIsSignDialogOpen
}) => {
  const canSign = (
    contract.status !== 'signed' && 
    contract.status !== 'expired' && 
    contract.status !== 'cancelled' && 
    !contract.client_signed
  );
  
  return (
    <div className="bg-muted/50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">Estado del contrato</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status information */}
        <div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {contract.status === 'signed' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : contract.status === 'expired' ? (
                <Clock className="h-5 w-5 text-red-500" />
              ) : contract.status === 'cancelled' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Clock className="h-5 w-5 text-amber-500" />
              )}
              <span className="font-medium">
                {contract.status === 'draft' ? 'Borrador' :
                 contract.status === 'sent' ? 'Enviado' :
                 contract.status === 'signed' ? 'Firmado' :
                 contract.status === 'expired' ? 'Expirado' :
                 'Cancelado'}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {contract.status === 'signed' 
                ? 'Este contrato ha sido firmado por ambas partes y está en vigor.'
                : contract.status === 'expired'
                ? 'Este contrato ha expirado y ya no puede ser firmado.'
                : contract.status === 'cancelled'
                ? 'Este contrato ha sido cancelado.'
                : contract.status === 'sent'
                ? 'Este contrato está pendiente de firma.'
                : 'Este contrato está en fase de borrador.'}
            </p>
            
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
        </div>
        
        {/* Signatures */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium mb-2">Firma Administrador</h4>
            {contract.admin_signed ? (
              <div>
                <div className="border rounded-md p-2 mb-2">
                  <img 
                    src={contract.admin_signature} 
                    alt="Firma administrador" 
                    className="h-14 object-contain mx-auto"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Firmado el {new Date(contract.admin_signed_at!).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Pendiente de firma
              </p>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-medium mb-2">Firma Cliente</h4>
            {contract.client_signed ? (
              <div>
                <div className="border rounded-md p-2 mb-2">
                  <img 
                    src={contract.client_signature} 
                    alt="Firma cliente" 
                    className="h-14 object-contain mx-auto"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Firmado el {new Date(contract.client_signed_at!).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Pendiente de firma
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Signature Dialog */}
      <SignatureDialog
        open={isSignDialogOpen}
        onOpenChange={setIsSignDialogOpen}
        onSign={onSign}
        title="Firmar Contrato"
        description={`Al firmar este contrato, confirmas que has leído y aceptas los términos y condiciones establecidos en "${contract.title}".`}
      />
    </div>
  );
};

export default SignatureSection;
