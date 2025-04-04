
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PenLine, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PublicContract } from './types';
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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No firmado';
    return format(new Date(dateString), 'PPP', { locale: es });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin signature */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Firma de Administrador</h3>
          {contract.admin_signed ? (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-white">
                <img 
                  src={contract.admin_signature} 
                  alt="Firma del Administrador" 
                  className="max-h-16 mx-auto"
                />
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Firmado el: {formatDate(contract.admin_signed_at)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-md">
              <p className="text-muted-foreground">Pendiente de firma</p>
            </div>
          )}
        </Card>

        {/* Client signature */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Firma del Cliente</h3>
          {contract.client_signed ? (
            <div className="space-y-4">
              <div className="border rounded-md p-4 bg-white">
                <img 
                  src={contract.client_signature} 
                  alt="Firma del Cliente" 
                  className="max-h-16 mx-auto"
                />
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Firmado el: {formatDate(contract.client_signed_at)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 border border-dashed rounded-md">
                <p className="text-muted-foreground mb-4">Pendiente de firma</p>
                {contract.status !== 'cancelled' && contract.status !== 'expired' && (
                  <Button 
                    onClick={onOpenSignDialog}
                    variant="default"
                    className="w-full"
                  >
                    <PenLine className="mr-2 h-4 w-4" />
                    Firmar ahora
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Signature Dialog */}
      {isSignDialogOpen && (
        <SignatureDialog
          open={isSignDialogOpen}
          onOpenChange={setIsSignDialogOpen}
          onSign={onSign}
          title="Firma del Cliente"
          description="Dibuja tu firma en el área a continuación para firmar este contrato."
        />
      )}
    </>
  );
};

export default SignatureSection;
