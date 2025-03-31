
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';
import { useClients } from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Plus, Calendar, User, File } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const ReportsTab = () => {
  const { reports, isLoading } = useReports();
  const { clients } = useClients();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports?.filter(report => 
    report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getClientName(report.clientId)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function getClientName(clientId: string | undefined) {
    if (!clientId) return 'N/A';
    
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Informes SEO</h1>
        <Button onClick={() => navigate('/reports/new')} className="flex gap-2">
          <Plus size={16} />
          Nuevo Informe
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
              <Button onClick={() => navigate('/reports/new')} variant="outline" className="gap-2">
                <Plus size={16} />
                Crear nuevo informe
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-medium text-muted-foreground py-3 px-4">Informe</th>
                    <th className="text-left font-medium text-muted-foreground py-3 px-4 hidden md:table-cell">Cliente</th>
                    <th className="text-left font-medium text-muted-foreground py-3 px-4 hidden sm:table-cell">Fecha</th>
                    <th className="text-left font-medium text-muted-foreground py-3 px-4">Estado</th>
                    <th className="text-right font-medium text-muted-foreground py-3 px-4">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReports?.map((report) => (
                    <tr key={report.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="truncate max-w-[150px]">
                            <p className="font-medium truncate">{report.title || 'Sin título'}</p>
                            <p className="text-sm text-muted-foreground truncate">{report.businessName || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{getClientName(report.clientId)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{report.createdAt ? format(new Date(report.createdAt), 'dd/MM/yyyy') : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={report.status === 'completed' ? 'success' : 'default'}>
                          {report.status === 'completed' ? 'Completado' : 'En progreso'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/reports/${report.id}`}>
                            <File className="h-4 w-4" />
                            <span className="ml-2">Ver</span>
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
