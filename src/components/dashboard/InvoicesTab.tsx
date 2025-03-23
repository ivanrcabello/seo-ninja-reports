
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Search, RefreshCw, FileText, Eye, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { ClientInvoice } from '@/types/client.types';
import { useNavigate } from 'react-router-dom';

const InvoicesTab: React.FC = () => {
  const [invoices, setInvoices] = useState<(ClientInvoice & { client_name: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Stats
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [overdueAmount, setOverdueAmount] = useState(0);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('client_invoices')
        .select(`
          *,
          clients(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to flatten the client name
      const formattedData = data.map(invoice => ({
        ...invoice,
        client_name: invoice.clients?.name || 'Cliente desconocido'
      })) as (ClientInvoice & { client_name: string })[];

      setInvoices(formattedData);

      // Calculate statistics
      calculateStats(formattedData);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (invoicesData: (ClientInvoice & { client_name: string })[]) => {
    const total = invoicesData.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const paid = invoicesData
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const pending = invoicesData
      .filter(invoice => invoice.status === 'pending')
      .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const overdue = invoicesData
      .filter(invoice => invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

    setTotalAmount(total);
    setPaidAmount(paid);
    setPendingAmount(pending);
    setOverdueAmount(overdue);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchInvoices();
    setIsRefreshing(false);
  };

  const handleExportCSV = () => {
    // Filter the invoices based on current filters
    const filteredInvoices = getFilteredInvoices();
    
    // Create CSV content
    const headers = 'ID,Cliente,Título,Cantidad,Estado,Fecha de vencimiento,Fecha de pago,Método de pago,Fecha de creación\n';
    const rows = filteredInvoices.map(invoice => {
      return [
        invoice.id,
        invoice.client_name,
        invoice.title,
        invoice.amount,
        getStatusText(invoice.status),
        invoice.due_date ? format(new Date(invoice.due_date), 'dd/MM/yyyy') : '',
        invoice.payment_date ? format(new Date(invoice.payment_date), 'dd/MM/yyyy') : '',
        invoice.payment_method || '',
        format(new Date(invoice.created_at), 'dd/MM/yyyy')
      ].join(',');
    }).join('\n');
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `facturas_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pagada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Vencida</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencida';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getFilteredInvoices = () => {
    return invoices.filter(invoice => {
      const matchesSearch = 
        invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Handle view invoice
  const handleViewInvoice = (invoice: ClientInvoice & { client_name: string }) => {
    if (invoice.client_id) {
      navigate(`/clients/${invoice.client_id}?tab=invoices&invoiceId=${invoice.id}`);
    }
  };

  // Handle edit invoice
  const handleEditInvoice = (invoice: ClientInvoice & { client_name: string }) => {
    if (invoice.client_id) {
      navigate(`/clients/${invoice.client_id}?tab=invoices&invoiceId=${invoice.id}&edit=true`);
    }
  };

  const filteredInvoices = getFilteredInvoices();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Facturado" 
          value={formatCurrency(totalAmount)} 
          icon={FileText}
          description="Importe total facturado" 
          className="bg-primary/10"
        />
        <StatsCard 
          title="Pagado" 
          value={formatCurrency(paidAmount)} 
          icon={FileText}
          description="Importe pagado" 
          className="bg-green-500/10"
        />
        <StatsCard 
          title="Pendiente" 
          value={formatCurrency(pendingAmount)} 
          icon={FileText}
          description="Importe pendiente de cobro" 
          className="bg-yellow-500/10"
        />
        <StatsCard 
          title="Vencido" 
          value={formatCurrency(overdueAmount)} 
          icon={FileText}
          description="Importe vencido" 
          className="bg-red-500/10"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Gestión de Facturas</CardTitle>
              <CardDescription>
                Visualiza y gestiona todas las facturas en un solo lugar
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1 flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar facturas..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="border rounded px-3 py-2 bg-background text-foreground"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="paid">Pagadas</option>
                <option value="overdue">Vencidas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Fecha de pago</TableHead>
                      <TableHead>Método de pago</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No se encontraron facturas con los filtros actuales
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.client_name}</TableCell>
                          <TableCell>{invoice.title}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Number(invoice.amount))}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>
                            {invoice.due_date && format(new Date(invoice.due_date), 'dd MMM yyyy', { locale: es })}
                          </TableCell>
                          <TableCell>
                            {invoice.payment_date && format(new Date(invoice.payment_date), 'dd MMM yyyy', { locale: es })}
                          </TableCell>
                          <TableCell>{invoice.payment_method || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewInvoice(invoice)}
                                title="Ver factura"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditInvoice(invoice)}
                                title="Editar factura"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                Mostrando {filteredInvoices.length} de {invoices.length} facturas
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  className = ""
}) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default InvoicesTab;
