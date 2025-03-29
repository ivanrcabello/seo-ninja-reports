
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';

interface Contract {
  id: string;
  title: string;
  status: string;
  created_at: string;
  client_signed: boolean;
}

interface ClientPortalContractsProps {
  clientId: string;
}

const ClientPortalContracts: React.FC<ClientPortalContractsProps> = ({ clientId }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        clientPortalLogger.info('Fetching contracts for client', { clientId }, 'ClientPortalContracts');
        
        // Fetch the client token from localStorage
        const sessionString = localStorage.getItem('clientPortalSession');
        if (!sessionString) {
          throw new Error('No active session found');
        }
        
        const session = JSON.parse(sessionString);
        const clientToken = session.token;
        
        // Make the RPC call with custom headers
        const { data, error } = await supabase.rpc(
          'get_client_portal_contracts',
          { client_id_param: clientId },
          { headers: { 'x-client-token': clientToken } }
        );

        if (error) {
          clientPortalLogger.error('Error fetching contracts', error, 'ClientPortalContracts');
          console.error('Error fetching contracts:', error);
          throw error;
        }
        
        clientPortalLogger.info(`Successfully fetched ${data?.length || 0} contracts`, { count: data?.length }, 'ClientPortalContracts');
        console.log('Contracts data:', data);
        setContracts(data || []);
      } catch (err: any) {
        console.error('Error fetching contracts:', err);
        clientPortalLogger.error('Error fetching contracts', err, 'ClientPortalContracts');
        toast.error('Error al cargar los contratos');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [clientId]);

  const getStatusBadge = (status: string, signed: boolean) => {
    if (status === 'signed' || signed) {
      return <Badge className="bg-green-500">Firmado</Badge>;
    }
    
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-500">Borrador</Badge>;
      case 'sent':
        return <Badge className="bg-yellow-500">Pendiente de firma</Badge>;
      case 'expired':
        return <Badge className="bg-red-500">Expirado</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const viewContract = (id: string) => {
    // Open contract in new tab or modal
    window.open(`/contracts/${id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contratos</h2>
      <p className="text-muted-foreground">
        Consulta y firma los contratos.
      </p>
      
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : contracts.length > 0 ? (
            <div className="space-y-4">
              {contracts.map(contract => (
                <div key={contract.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div>
                    <h3 className="font-medium">{contract.title}</h3>
                    <div className="flex space-x-3 text-sm text-muted-foreground">
                      <span>{getStatusBadge(contract.status, contract.client_signed)}</span>
                      <span>•</span>
                      <span>
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {format(new Date(contract.created_at), 'dd/MM/yyyy')}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => viewContract(contract.id)}
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Ver contrato
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No hay contratos disponibles en este momento.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortalContracts;
