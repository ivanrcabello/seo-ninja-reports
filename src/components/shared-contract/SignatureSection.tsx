
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Download } from 'lucide-react';
import { PublicContract } from './types';

interface SignatureSectionProps {
  contract: PublicContract;
  onOpenSignDialog: () => void;
  onPrint: () => void;
}

const SignatureSection: React.FC<SignatureSectionProps> = ({ 
  contract, 
  onOpenSignDialog, 
  onPrint 
}) => {
  if (!contract) return null;
  
  return (
    <div className="mt-8 p-6 bg-muted/30 rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Firmas</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Admin signature box */}
        <div className="border rounded-md p-4 bg-background">
          <h3 className="text-sm font-medium mb-2">Firma del Administrador</h3>
          <div className="h-24 flex items-center justify-center">
            {contract.admin_signature ? (
              <img 
                src={contract.admin_signature} 
                alt="Firma del administrador" 
                className="max-h-full object-contain" 
              />
            ) : (
              <p className="text-sm text-muted-foreground">Pendiente de firma</p>
            )}
          </div>
          {contract.admin_signed && contract.admin_signed_at && (
            <p className="text-xs text-muted-foreground mt-2">
              Firmado el: {new Date(contract.admin_signed_at).toLocaleDateString()}
            </p>
          )}
        </div>
        
        {/* Client signature box */}
        <div className="border rounded-md p-4 bg-background">
          <h3 className="text-sm font-medium mb-2">Firma del Cliente</h3>
          <div className="h-24 flex items-center justify-center">
            {contract.client_signature ? (
              <img 
                src={contract.client_signature} 
                alt="Firma del cliente" 
                className="max-h-full object-contain" 
              />
            ) : (
              <p className="text-sm text-muted-foreground">Pendiente de firma</p>
            )}
          </div>
          {contract.client_signed && contract.client_signed_at && (
            <p className="text-xs text-muted-foreground mt-2">
              Firmado el: {new Date(contract.client_signed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
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
    </div>
  );
};

export default SignatureSection;
