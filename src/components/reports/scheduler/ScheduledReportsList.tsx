
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useReports from '@/hooks/useReports';
import { ScheduledReport } from '@/types/report-hooks.types';
import useClients from '@/hooks/useClients';
import { Loader2, Calendar, Timer, Trash, Play, Pause } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import ScheduleReportDialog from './ScheduleReportDialog';

interface ScheduledReportsListProps {
  clientId?: string;
}

const ScheduledReportsList: React.FC<ScheduledReportsListProps> = ({ clientId }) => {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(clientId || null);
  
  const { getScheduledReports, deleteScheduledReport, toggleScheduledReport } = useReports();
  const { getClient, clients } = useClients();
  
  const loadScheduledReports = async () => {
    setIsLoading(true);
    try {
      const reports = await getScheduledReports(clientId);
      setScheduledReports(reports);
    } catch (error) {
      console.error('Error loading scheduled reports:', error);
      toast.error('Error al cargar informes programados');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadScheduledReports();
  }, [clientId]);
  
  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await toggleScheduledReport(id, !currentActive);
      
      // Update local state
      setScheduledReports(prevReports => 
        prevReports.map(report => 
          report.id === id ? { ...report, active: !currentActive } : report
        )
      );
      
      toast.success(
        !currentActive ? 'Informe programado activado' : 'Informe programado pausado'
      );
    } catch (error) {
      console.error('Error toggling scheduled report:', error);
      toast.error('Error al cambiar estado del informe programado');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este informe programado?')) {
      return;
    }
    
    try {
      await deleteScheduledReport(id);
      
      // Update local state
      setScheduledReports(prevReports => 
        prevReports.filter(report => report.id !== id)
      );
      
      toast.success('Informe programado eliminado');
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      toast.error('Error al eliminar informe programado');
    }
  };
  
  const getFrequencyText = (report: ScheduledReport) => {
    switch (report.frequency) {
      case 'weekly':
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return `Semanal (${days[report.dayOfWeek || 0]})`;
      case 'monthly':
        return `Mensual (Día ${report.dayOfMonth})`;
      case 'quarterly':
        return `Trimestral (Día ${report.dayOfMonth})`;
      default:
        return 'Desconocido';
    }
  };
  
  const handleShowScheduleDialog = (clientId: string) => {
    setSelectedClient(clientId);
    setShowScheduleDialog(true);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Informes Programados</CardTitle>
        {clientId && (
          <Button onClick={() => handleShowScheduleDialog(clientId)}>
            <Calendar className="h-4 w-4 mr-2" />
            Programar nuevo informe
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : scheduledReports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No hay informes programados 
              {clientId ? ' para este cliente' : ''}
            </p>
            {clientId && (
              <Button onClick={() => handleShowScheduleDialog(clientId)}>
                Programar nuevo informe
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                {!clientId && <TableHead>Cliente</TableHead>}
                <TableHead>Frecuencia</TableHead>
                <TableHead>Próxima ejecución</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledReports.map(report => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium truncate max-w-[200px]">
                    {report.url}
                  </TableCell>
                  {!clientId && (
                    <TableCell>
                      {getClient(report.clientId)?.name || 'Cliente no encontrado'}
                    </TableCell>
                  )}
                  <TableCell>{getFrequencyText(report)}</TableCell>
                  <TableCell>
                    {format(new Date(report.nextRunDate), 'PPP', { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={report.active}
                      onCheckedChange={() => handleToggleActive(report.id, report.active)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(report.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      
      {selectedClient && (
        <ScheduleReportDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          client={getClient(selectedClient)}
          onScheduled={loadScheduledReports}
        />
      )}
    </Card>
  );
};

export default ScheduledReportsList;
