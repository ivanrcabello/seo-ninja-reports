
import React from 'react';
import { ExternalLink, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import ClientCard from './ClientCard';
import useClients from '@/hooks/useClients';
import { Client } from '@/types/client.types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface ClientListProps {
  clients?: Client[];
  view?: 'cards' | 'table';
  reportsMap?: Record<string, number>;
}

const ClientList: React.FC<ClientListProps> = ({ 
  clients: providedClients, 
  view = 'cards',
  reportsMap = {}
}) => {
  const { clients: allClients, isLoading } = useClients();
  
  // Use provided clients or fall back to all clients from the hook
  const clients = providedClients || allClients;

  if (view === 'table') {
    return (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Industria</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Sitio Web</TableHead>
                <TableHead>Informes</TableHead>
                <TableHead>Fecha de registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No hay clientes
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5">
                        {client.industry || "Sin categoría"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {client.active ? (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm">Activo</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-muted-foreground">Inactivo</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <a 
                        href={client.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary flex items-center hover:underline"
                      >
                        {client.website.replace(/^https?:\/\//, '').substring(0, 20)}
                        {client.website.replace(/^https?:\/\//, '').length > 20 ? '...' : ''}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-primary mr-1" />
                        <span>{reportsMap[client.id] || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.created_at ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-sm">{format(new Date(client.created_at), 'dd/MM/yyyy')}</span>
                        </div>
                      ) : (
                        "Fecha desconocida"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/clients/${client.id}`}>
                          Ver cliente
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.length === 0 && !isLoading ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No hay clientes.</p>
        </div>
      ) : (
        clients.map((client, index) => (
          <ClientCard 
            key={client.id} 
            client={client} 
            index={index} 
            reportsCount={reportsMap[client.id] || 0}
          />
        ))
      )}
    </div>
  );
};

export default ClientList;
