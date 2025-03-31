
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';
import { clientPortalApi } from '@/services/clientPortalApiService';
import { Badge } from '@/components/ui/badge';

interface Proposal {
  id: string;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  price?: number;
  shared_url?: string;
}

interface ClientPortalProposalsProps {
  clientId: string;
}

const ClientPortalProposals: React.FC<ClientPortalProposalsProps> = ({ clientId }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        clientPortalLogger.info('Fetching proposals for client', { clientId }, 'ClientPortalProposals');
        
        const data = await clientPortalApi.getProposals(clientId);
        clientPortalLogger.info(`Successfully fetched ${data.length} proposals`, { count: data.length }, 'ClientPortalProposals');
        setProposals(data);
      } catch (err: any) {
        console.error('Error fetching proposals:', err);
        clientPortalLogger.error('Error fetching proposals', err, 'ClientPortalProposals');
        toast.error('Error al cargar las propuestas');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [clientId]);

  const viewProposal = (proposal: Proposal) => {
    if (proposal.shared_url) {
      window.open(`/shared/proposals/${proposal.shared_url}`, '_blank');
    } else {
      toast.error('Esta propuesta no tiene un enlace compartido válido');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'aceptada':
        return <Badge className="bg-green-500">Aceptada</Badge>;
      case 'pending':
      case 'pendiente':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'rejected':
      case 'rechazada':
        return <Badge className="bg-red-500">Rechazada</Badge>;
      case 'draft':
      case 'borrador':
        return <Badge variant="outline">Borrador</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tus Propuestas</h2>
      <p className="text-muted-foreground">
        Aquí encontrarás todas las propuestas de servicios compartidas contigo.
      </p>
      
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : proposals.length > 0 ? (
            <div className="space-y-4">
              {proposals.map(proposal => (
                <div key={proposal.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{proposal.title}</h3>
                      {getStatusBadge(proposal.status)}
                    </div>
                    {proposal.description && (
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {proposal.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {format(new Date(proposal.created_at), 'dd/MM/yyyy')}
                      {proposal.price && (
                        <span className="ml-2 font-medium">
                          {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(proposal.price)}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => viewProposal(proposal)}
                    disabled={!proposal.shared_url}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver propuesta
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay propuestas disponibles en este momento.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortalProposals;
