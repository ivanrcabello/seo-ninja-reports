
import React from 'react';
import { Client } from '@/types/client.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlurredCard from '@/components/ui/BlurredCard';
import { FileText, PlusCircle } from 'lucide-react';
import { useClientContracts } from '@/hooks/useClientContracts';

interface ClientContractsListProps {
  client: Client;
}

const ClientContractsList: React.FC<ClientContractsListProps> = ({ client }) => {
  const { 
    contracts,
    isLoading,
    fetchContracts,
    createContract
  } = useClientContracts(client.id);

  React.useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleCreateContract = () => {
    // This would typically open a dialog to create a new contract
    console.log('Create contract for', client.name);
  };

  return (
    <BlurredCard>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <CardTitle className="text-xl">Contratos</CardTitle>
          <CardDescription>
            {isLoading ? 'Cargando...' : `${contracts?.length || 0} contratos para ${client.name}`}
          </CardDescription>
        </div>
        <Button onClick={handleCreateContract} className="mt-4 sm:mt-0">
          <PlusCircle className="h-4 w-4 mr-1.5" /> Nuevo Contrato
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse">Cargando contratos...</div>
          </div>
        ) : contracts && contracts.length > 0 ? (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div 
                key={contract.id}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{contract.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      contract.status === 'draft' ? 'bg-muted text-muted-foreground' :
                      contract.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      contract.status === 'signed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {contract.status === 'draft' ? 'Borrador' :
                       contract.status === 'sent' ? 'Enviado' :
                       contract.status === 'signed' ? 'Firmado' :
                       contract.status === 'expired' ? 'Expirado' : 'Cancelado'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay contratos aún</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primer contrato para {client.name}
            </p>
            <Button onClick={handleCreateContract}>
              <PlusCircle className="h-4 w-4 mr-1.5" /> Nuevo Contrato
            </Button>
          </div>
        )}
      </CardContent>
    </BlurredCard>
  );
};

export default ClientContractsList;
