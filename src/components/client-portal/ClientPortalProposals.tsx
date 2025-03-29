
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';
import { clientPortalApi } from '@/services/clientPortalApiService';
import { useNavigate } from 'react-router-dom';

interface Proposal {
  id: string;
  title: string;
  status: string;
  created_at: string;
  shared_url: string;
}

interface ClientPortalProposalsProps {
  clientId: string;
}

const ClientPortalProposals: React.FC<ClientPortalProposalsProps> = ({ clientId }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        clientPortalLogger.info('Fetching proposals for client', { clientId }, 'ClientPortalProposals');
        
        const data = await clientPortalApi.getProposals(clientId);
        clientPortalLogger.info(`Successfully fetched ${data.length} proposals`, { count: data.length }, 'ClientPortalProposals');
        console.log('Proposals data:', data);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-500">Aceptada</Badge>;
      case 'sent':
        return <Badge className="bg-yellow-500">Enviada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rechazada</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500">Borrador</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const viewProposal = (proposal: Proposal) => {
    // Navigate to the shared proposal URL if available, or the ID-based URL
    if (proposal.shared_url) {
      navigate(`/shared/proposals/${proposal.shared_url}`);
    } else {
      navigate(`/shared/proposals/${proposal.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Propuestas</h2>
      <p className="text-muted-foreground">
        Revisa las propuestas de servicios.
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
                    <h3 className="font-medium">{proposal.title}</h3>
                    <div className="flex space-x-3 text-sm text-muted-foreground">
                      <span>{getStatusBadge(proposal.status)}</span>
                      <span>•</span>
                      <span>{format(new Date(proposal.created_at), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => viewProposal(proposal)}
                  >
                    <ChevronRight className="h-4 w-4" />
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
