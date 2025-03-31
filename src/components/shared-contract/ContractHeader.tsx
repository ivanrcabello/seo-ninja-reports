
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Pen } from 'lucide-react';
import { SharedContentStatus } from '@/types/shared-content';
import { Badge } from '@/components/ui/badge';

export interface ContractHeaderProps {
  title?: string;
  client?: string;
  canSign: boolean;
  status: SharedContentStatus;
  onOpenSignDialog?: () => void;
  onPrint?: () => void;
}

const ContractHeader: React.FC<ContractHeaderProps> = ({
  title,
  client,
  canSign,
  status,
  onOpenSignDialog,
  onPrint
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-green-500">Firmado</Badge>;
      case 'draft':
        return <Badge variant="outline">Borrador</Badge>;
      case 'sent':
        return <Badge className="bg-blue-500">Enviado</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expirado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="bg-background/60 backdrop-blur-sm border-b py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{title || 'Contrato'}</h1>
            {client && (
              <p className="text-muted-foreground">Cliente: {client}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            
            {onPrint && (
              <Button variant="outline" onClick={onPrint} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            )}
            
            {canSign && status !== 'signed' && onOpenSignDialog && (
              <Button onClick={onOpenSignDialog} size="sm">
                <Pen className="h-4 w-4 mr-2" />
                Firmar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractHeader;
