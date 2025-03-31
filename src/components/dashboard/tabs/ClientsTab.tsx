
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClients } from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClientList from '@/components/dashboard/ClientList';
import { Button } from '@/components/ui/button';
import { UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Client } from './OverviewTab';

export interface ClientsTabProps {
  clients?: Client[];
  reports?: any[];
}

const ClientsTab: React.FC<ClientsTabProps> = (props) => {
  const { clients, isLoading } = useClients();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredClients = clients?.filter(client => 
    client.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => navigate('/clients/new')} className="flex gap-2">
          <UserPlus size={16} />
          <span className="hidden sm:inline">Nuevo Cliente</span>
          <span className="sm:hidden">Nuevo</span>
        </Button>
      </div>

      <Card className="border border-border">
        <CardHeader className="bg-muted/50 px-6">
          <CardTitle className="text-lg font-medium">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Cargando clientes...</p>
            </div>
          ) : filteredClients?.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No se encontraron clientes</p>
              <Button onClick={() => navigate('/clients/new')} variant="outline" className="gap-2">
                <UserPlus size={16} />
                Añadir nuevo cliente
              </Button>
            </div>
          ) : (
            <ClientList clients={filteredClients || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsTab;
