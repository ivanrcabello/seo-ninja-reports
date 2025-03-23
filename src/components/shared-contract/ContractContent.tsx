
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PublicContract } from './types';
import SignatureSection from './SignatureSection';
import ContractActions from './ContractActions';

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
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <Card className="mb-8 overflow-hidden border-t-4 border-t-red-500 shadow-md">
        <CardHeader className="bg-muted/30">
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            {error || 'No se pudo cargar el contrato'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 overflow-hidden border-t-4 border-t-primary shadow-md">
      <CardHeader className="bg-muted/30">
        <CardTitle>Detalles del Contrato</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: contract.content }}
        />
      </CardContent>
      <CardFooter className="p-6 flex-col items-start bg-muted/10 border-t">
        {/* Sección de firmas si hay alguna */}
        <SignatureSection contract={contract} />
        
        <ContractActions 
          contract={contract} 
          onOpenSignDialog={onOpenSignDialog} 
          onPrint={onPrint} 
        />
      </CardFooter>
    </Card>
  );
};

export default ContractContent;
