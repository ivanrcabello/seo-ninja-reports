
import React from 'react';
import { useClientProposals } from '@/hooks/useClientProposals';
import { Client } from '@/types/client.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import BlurredCard from '@/components/ui/BlurredCard';
import { FileText, PlusCircle } from 'lucide-react';

interface ClientProposalsListProps {
  client: Client;
}

const ClientProposalsList: React.FC<ClientProposalsListProps> = ({ client }) => {
  const { 
    proposals, 
    isLoading, 
    dialogOpen, 
    setDialogOpen, 
    handleCreateProposal,
    handleEditProposal,
    handleSaveProposal,
    handleDeleteProposal,
    fetchProposals
  } = useClientProposals(client.id);

  React.useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return (
    <BlurredCard>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <CardTitle className="text-xl">Propuestas</CardTitle>
          <CardDescription>
            {isLoading ? 'Cargando...' : `${proposals.length} propuestas para ${client.name}`}
          </CardDescription>
        </div>
        <Button onClick={handleCreateProposal} className="mt-4 sm:mt-0">
          <PlusCircle className="h-4 w-4 mr-1.5" /> Nueva Propuesta
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse">Cargando propuestas...</div>
          </div>
        ) : proposals.length > 0 ? (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div 
                key={proposal.id}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => handleEditProposal(proposal)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {proposal.description || 'Sin descripción'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      proposal.status === 'draft' ? 'bg-muted text-muted-foreground' :
                      proposal.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {proposal.status === 'draft' ? 'Borrador' :
                       proposal.status === 'sent' ? 'Enviada' :
                       proposal.status === 'accepted' ? 'Aceptada' :
                       'Rechazada'}
                    </div>
                    {proposal.price && (
                      <div className="text-sm font-medium">
                        {proposal.price.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay propuestas aún</h3>
            <p className="text-muted-foreground mb-6">
              Crea tu primera propuesta para {client.name}
            </p>
            <Button onClick={handleCreateProposal}>
              <PlusCircle className="h-4 w-4 mr-1.5" /> Nueva Propuesta
            </Button>
          </div>
        )}
      </CardContent>
    </BlurredCard>
  );
};

export default ClientProposalsList;
