
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReports } from '@/hooks/useReports';
import { useClients } from '@/hooks/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, FileText, PlusCircle, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Client, Report } from './OverviewTab';

export interface ReportsTabProps {
  reports?: Report[];
}

const ReportsTab: React.FC<ReportsTabProps> = ({ reports: propReports }) => {
  const { reports: hookReports, isLoading } = useReports();
  const { clients } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use reports from props if provided, otherwise use reports from hook
  const reports = propReports || hookReports || [];

  // Filter reports based on search query
  const filteredReports = reports.filter(report => 
    report.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string | Date | number) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Informes</h1>
        <Button asChild className="flex gap-2">
          <Link to="/reports/create">
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Crear informe</span>
            <span className="sm:hidden">Crear</span>
          </Link>
        </Button>
      </div>

      <Card className="border border-border">
        <CardHeader className="bg-muted/50 px-6">
          <CardTitle className="text-lg font-medium">Informes recientes</CardTitle>
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
          ) : filteredReports.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">No se encontraron informes</p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/reports/create">
                  <PlusCircle size={16} />
                  Crear nuevo informe
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredReports.map((report, index) => (
                <div key={report.id || index} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <Link to={`/reports/${report.id}`} className="font-medium hover:text-primary transition-colors">
                        {report.title}
                      </Link>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {report.createdAt ? formatDate(report.createdAt) : 'Fecha no disponible'}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/reports/${report.id}`}>Ver informe</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;
