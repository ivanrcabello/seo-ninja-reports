
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Client } from '@/types/client.types';
import { Report } from '@/types/report.types';
import { FileText, Plus, BarChart } from 'lucide-react';
import ClientReportsList from '../ClientReportsList';

interface ClientSummaryTabProps {
  client: Client;
  reports: Report[];
  onViewReports: () => void;
  onCreateReport: () => void;
}

const ClientSummaryTab: React.FC<ClientSummaryTabProps> = ({
  client,
  reports,
  onViewReports,
  onCreateReport
}) => {
  const navigate = useNavigate();
  
  const handleCreateReport = () => {
    navigate(`/clients/${client.id}/generate-report`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Resumen del Cliente</h2>
        <div className="flex gap-2">
          <Button onClick={handleCreateReport} className="flex gap-2">
            <FileText size={16} />
            <span className="hidden sm:inline">Crear Informe</span>
            <span className="sm:hidden">Informe</span>
          </Button>
          <Button variant="outline" asChild className="flex gap-2">
            <Link to={`/clients/${client.id}/crawler/new`}>
              <BarChart size={16} />
              <span className="hidden sm:inline">Análisis SEO</span>
              <span className="sm:hidden">Análisis</span>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informes Recientes</CardTitle>
            {reports.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onViewReports}>
                Ver Todos
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ClientReportsList 
              reports={reports.slice(0, 5)} 
              clientId={client.id}
              showCreateButton={reports.length === 0}
              onCreateReport={handleCreateReport}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSummaryTab;
