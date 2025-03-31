
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
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
  created_at: string;
  client_signed: boolean;
  client_signed_at?: string;
  admin_signed: boolean;
  admin_signed_at?: string;
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
      // Open in a new tab with proper URL structure
      window.open(`/shared/contracts/${contract.shared_url}`, '_blank');
    } else {
      toast.error('Este contrato no tiene un enlace compartido válido');
    }
  };

  const getStatusBadge = (contract: Contract) => {
    if (contract.status === 'signed' || (contract.client_signed && contract.admin_signed)) {
      return <Badge className="bg-green-500">Firmado</Badge>;
    } else if (contract.client_signed) {
      return <Badge className="bg-blue-500">Firmado por cliente</Badge>;
    } else if (contract.admin_signed) {
      return <Badge className="bg-yellow-500">Pendiente de firma</Badge>;
    } else {
      return <Badge variant="outline">Borrador</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tus Contratos</h2>
      <p className="text-muted-foreground">
        Aquí encontrarás todos tus contratos y podrás revisarlos y firmarlos.
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
                <div 
                  key={contract.id} 
                  className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => viewContract(contract)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{contract.title}</h3>
                      {getStatusBadge(contract)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {format(new Date(contract.created_at), 'dd/MM/yyyy')}
                      
                      <span className="ml-3">
                        {contract.client_signed ? 
                          <CheckCircle className="inline h-3 w-3 text-green-500 mr-1" /> : 
                          <XCircle className="inline h-3 w-3 text-muted-foreground mr-1" />
                        }
                        Firma cliente
                      </span>
                      
                      <span className="ml-3">
                        {contract.admin_signed ? 
                          <CheckCircle className="inline h-3 w-3 text-green-500 mr-1" /> : 
                          <XCircle className="inline h-3 w-3 text-muted-foreground mr-1" />
                        }
                        Firma empresa
                      </span>
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewContract(contract);
                    }}
                    disabled={!contract.shared_url}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver contrato
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
