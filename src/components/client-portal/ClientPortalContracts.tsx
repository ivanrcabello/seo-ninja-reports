
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, CheckCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';
import { clientPortalApi } from '@/services/clientPortalApiService';
import { Badge } from '@/components/ui/badge';

interface Contract {
  id: string;
  title: string;
  status: string;
  client_signed: boolean;
  client_signed_at?: string;
  created_at: string;
  updated_at: string;
  shared_url?: string;
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
        
        const data = await clientPortalApi.getContracts(clientId);
        clientPortalLogger.info(`Successfully fetched ${data.length} contracts`, { count: data.length }, 'ClientPortalContracts');
        setContracts(data);
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

  const viewContract = (contract: Contract) => {
    if (contract.shared_url) {
      window.open(`/shared/contracts/${contract.shared_url}`, '_blank');
    } else {
      toast.error('Este contrato no tiene un enlace compartido válido');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'signed':
      case 'firmado':
        return <Badge className="bg-green-500">Firmado</Badge>;
      case 'sent':
      case 'enviado':
        return <Badge className="bg-yellow-500">Enviado</Badge>;
      case 'draft':
      case 'borrador':
        return <Badge variant="outline">Borrador</Badge>;
      case 'expired':
      case 'expirado':
        return <Badge className="bg-red-500">Expirado</Badge>;
      case 'cancelled':
      case 'cancelado':
        return <Badge variant="outline" className="bg-slate-500 text-white">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tus Contratos</h2>
      <p className="text-muted-foreground">
        Aquí encontrarás todos tus contratos y podrás ver su estado y firmarlos si es necesario.
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{contract.title}</h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {format(new Date(contract.created_at), 'dd/MM/yyyy')}
                      {contract.client_signed && (
                        <span className="ml-2 text-green-500 flex items-center text-xs">
                          <CheckCircle className="inline h-3 w-3 mr-1" />
                          Firmado el {contract.client_signed_at ? 
                            format(new Date(contract.client_signed_at), 'dd/MM/yyyy') : 
                            format(new Date(contract.updated_at), 'dd/MM/yyyy')}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => viewContract(contract)}
                    disabled={!contract.shared_url}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {!contract.client_signed && contract.status.toLowerCase() !== 'cancelled' ? 'Firmar contrato' : 'Ver contrato'}
                    <ExternalLink className="h-3 w-3 ml-1" />
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
