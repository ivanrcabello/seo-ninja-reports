
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Client } from '@/types/client.types';
import { BarChart } from 'lucide-react';

interface ClientSummaryTabProps {
  client: Client;
}

const ClientSummaryTab: React.FC<ClientSummaryTabProps> = ({
  client
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Resumen del Cliente</h2>
        <div className="flex gap-2">
          <Button variant="outline" asChild className="flex gap-2">
            <Link to={`/clients/${client.id}/documents`}>
              <BarChart size={16} />
              <span>Ver documentos</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p className="text-lg">{client.name}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sitio Web</p>
              <a 
                href={`https://${client.website.replace(/^https?:\/\//, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                {client.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
            
            {client.industry && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Industria</p>
                <p>{client.industry}</p>
              </div>
            )}
            
            {client.phone_number && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <p>{client.phone_number}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                No hay actividad reciente para mostrar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSummaryTab;
