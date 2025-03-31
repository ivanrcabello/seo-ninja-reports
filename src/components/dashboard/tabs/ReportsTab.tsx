import React from 'react';
import { Link } from 'react-router-dom';
import useReports from '@/hooks/useReports'; // Fixed import
import useClients from '@/hooks/useClients'; // Fixed import
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface ReportsTabProps {
  reports?: any[];
}

const ReportsTab: React.FC<ReportsTabProps> = (props) => {
  const { reports, isLoading } = useReports();
  const { clients } = useClients();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredReports = reports?.filter(report =>
    report.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Informes</h1>
        <Button asChild className="flex gap-2">
          <Link to="/reports/new">
            <Plus size={16} />
            <span className="hidden sm:inline">Nuevo Informe</span>
            <span className="sm:hidden">Nuevo</span>
          </Link>
        </Button>
      </div>

      <Card className="border border-border">
        <CardHeader className="bg-muted/50 px-6">
          <CardTitle className="text-lg font-medium">Lista de Informes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar informe..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Cargando informes...</p>
            </div>
          ) : filteredReports?.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No se encontraron informes</p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/reports/new">
                  <Plus size={16} />
                  Añadir nuevo informe
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports?.map(report => (
                <Link to={`/reports/${report.id}`} key={report.id}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Cliente: {clients.find(client => client.id === report.clientId)?.name || 'N/A'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
