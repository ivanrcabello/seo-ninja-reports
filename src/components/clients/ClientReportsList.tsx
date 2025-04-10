
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  FileText,
  Download,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  ExternalLink,
  Clock,
  Share2,
  FileBarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useReports from '@/hooks/useReports';
import { Report } from '@/types/report.types';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ShareReportDialog from '../reports/ShareReportDialog';
import TemplatesDialog from '../reports/templates/TemplatesDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClientReportsListProps {
  clientId: string;
  onCreateReport: () => void;
}

interface ReportsTableProps {
  reports: Report[];
  isLoading: boolean;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ reports, isLoading, onDelete, onRetry, onShare }) => {
  if (isLoading) {
    return <p>Cargando informes...</p>;
  }

  if (reports.length === 0) {
    return <p>No hay informes disponibles.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>
              <Link to={`/reports/${report.id}`} className="hover:underline">
                {report.title}
              </Link>
            </TableCell>
            <TableCell>{format(new Date(report.date), 'PPP', { locale: es })}</TableCell>
            <TableCell>
              {report.status === 'completed' && <Badge variant="success">Completado</Badge>}
              {report.status === 'processing' && <Badge variant="secondary">Procesando</Badge>}
              {report.status === 'failed' && <Badge variant="destructive">Fallido</Badge>}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to={`/reports/${report.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver informe
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare(report.id)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {report.status === 'failed' && (
                    <DropdownMenuItem onClick={() => onRetry(report.id)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reintentar
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-destructive" onClick={() => onDelete(report.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface ScheduledReportsListProps {
  clientId: string;
}

const ScheduledReportsList: React.FC<ScheduledReportsListProps> = ({ clientId }) => {
  const { getScheduledReports, deleteScheduledReport, toggleScheduledReport } = useReports();
  const [scheduledReports, setScheduledReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScheduledReports = async () => {
      try {
        setIsLoading(true);
        const reports = await getScheduledReports(clientId);
        setScheduledReports(reports);
      } catch (error) {
        console.error('Error loading scheduled reports:', error);
        toast.error('Error al cargar los informes programados');
      } finally {
        setIsLoading(false);
      }
    };

    loadScheduledReports();
  }, [clientId, getScheduledReports]);

  const handleDelete = async (id: string) => {
    try {
      await deleteScheduledReport(id);
      setScheduledReports(prev => prev.filter(report => report.id !== id));
      toast.success('Informe programado eliminado');
    } catch (error) {
      console.error('Error deleting scheduled report:', error);
      toast.error('Error al eliminar el informe programado');
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const updatedReport = await toggleScheduledReport(id, active);
      setScheduledReports(prev => prev.map(report => report.id === id ? updatedReport : report));
      toast.success(`Informe programado ${active ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error toggling scheduled report:', error);
      toast.error('Error al cambiar el estado del informe programado');
    }
  };

  if (isLoading) {
    return <p>Cargando informes programados...</p>;
  }

  if (scheduledReports.length === 0) {
    return <p>No hay informes programados disponibles.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>URL</TableHead>
          <TableHead>Frecuencia</TableHead>
          <TableHead>Próxima ejecución</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduledReports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>{report.url}</TableCell>
            <TableCell>{report.frequency}</TableCell>
            <TableCell>{format(new Date(report.nextRunDate), 'PPP', { locale: es })}</TableCell>
            <TableCell>
              {report.active ? <Badge variant="success">Activo</Badge> : <Badge>Inactivo</Badge>}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menú</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleToggle(report.id, !report.active)}>
                    {report.active ? 'Desactivar' : 'Activar'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(report.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ClientReportsList: React.FC<ClientReportsListProps> = ({ clientId, onCreateReport }) => {
  const { reports: allReports, isLoading, deleteReport, retryReport } = useReports();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reportToDeleteId, setReportToDeleteId] = useState<string | null>(null);
  const [clientReports, setClientReports] = useState<Report[]>([]);
  const [activeReports, setActiveReports] = useState<Report[]>([]);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);

  useEffect(() => {
    if (allReports) {
      const filteredReports = allReports.filter((report) => report.clientId === clientId);
      setClientReports(filteredReports);
      setActiveReports(filteredReports.filter((report) => report.status !== 'failed'));
    }
  }, [allReports, clientId]);

  const handleOpenDeleteDialog = (reportId: string) => {
    setReportToDeleteId(reportId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reportToDeleteId) {
      try {
        await deleteReport(reportToDeleteId);
        toast.success('Informe eliminado correctamente');
      } catch (error) {
        toast.error('Error al eliminar el informe');
      } finally {
        setIsDeleteDialogOpen(false);
        setReportToDeleteId(null);
      }
    }
  };

  const handleRetry = async (reportId: string) => {
    try {
      await retryReport(reportId);
      toast.success('Reintentando generación del informe');
    } catch (error) {
      toast.error('Error al reintentar el informe');
    }
  };

  const handleShare = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsShareDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Informes SEO
        </h2>
        <div className="flex gap-2">
          <Button asChild>
            <Link to={`/clients/${clientId}/generate-report`}>
              <FileText className="mr-2 h-4 w-4" />
              Nuevo informe
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => setShowTemplatesDialog(true)}>
            <FileBarChart className="mr-2 h-4 w-4" />
            Plantillas
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="scheduled">Programados</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <ReportsTable 
            reports={activeReports} 
            isLoading={isLoading} 
            onRetry={handleRetry}
            onDelete={handleOpenDeleteDialog}
            onShare={handleShare}
          />
        </TabsContent>
        
        <TabsContent value="all">
          <ReportsTable 
            reports={clientReports} 
            isLoading={isLoading} 
            onRetry={handleRetry}
            onDelete={handleOpenDeleteDialog}
            onShare={handleShare}
          />
        </TabsContent>
        
        <TabsContent value="scheduled">
          <ScheduledReportsList clientId={clientId} />
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El informe será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <ShareReportDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen}
        reportId={selectedReportId}
      />
      
      <TemplatesDialog 
        open={showTemplatesDialog} 
        onOpenChange={setShowTemplatesDialog}
        mode="save" 
      />
    </div>
  );
}

export default ClientReportsList;
