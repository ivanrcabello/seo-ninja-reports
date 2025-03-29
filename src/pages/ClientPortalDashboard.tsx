
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, FileText, CreditCard, ClipboardList, User, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { logoutClientPortal } from '@/services/clientPortalService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientPortalSession {
  account_id: string;
  client_id: string;
  token: string;
  expires_at: string;
}

interface Invoice {
  id: string;
  title: string;
  amount: number;
  status: string;
  due_date?: string;
  created_at: string;
}

interface Proposal {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface Contract {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface Report {
  id: string;
  title: string;
  created_at: string;
}

const ClientPortalDashboard = () => {
  const [session, setSession] = useState<ClientPortalSession | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedSession = localStorage.getItem('clientPortalSession');
    
    if (!storedSession) {
      navigate('/portal');
      return;
    }
    
    try {
      const parsedSession = JSON.parse(storedSession) as ClientPortalSession;
      
      // Check if session is expired
      if (new Date(parsedSession.expires_at) < new Date()) {
        handleLogout();
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return;
      }
      
      setSession(parsedSession);
      fetchClientData(parsedSession.client_id, parsedSession.token);
    } catch (err) {
      console.error('Error parsing session:', err);
      navigate('/portal');
    }
  }, [navigate]);
  
  const fetchClientData = async (clientId: string, token: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data for client ID:', clientId);
      
      // Set headers for all requests
      const customHeaders = { 'x-client-token': token };
      
      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('client_invoices')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .headers(customHeaders);
      
      if (invoicesError) {
        console.error('Error fetching invoices:', invoicesError);
        throw invoicesError;
      }
      
      console.log('Invoices fetched:', invoicesData);
      
      // Fetch proposals
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('client_proposals')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .headers(customHeaders);
      
      if (proposalsError) {
        console.error('Error fetching proposals:', proposalsError);
        throw proposalsError;
      }
      
      console.log('Proposals fetched:', proposalsData);
      
      // Fetch contracts
      const { data: contractsData, error: contractsError } = await supabase
        .from('client_contracts')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .headers(customHeaders);
      
      if (contractsError) {
        console.error('Error fetching contracts:', contractsError);
        throw contractsError;
      }
      
      console.log('Contracts fetched:', contractsData);
      
      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .headers(customHeaders);
      
      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
        throw reportsError;
      }
      
      console.log('Reports fetched:', reportsData);
      
      setInvoices(invoicesData || []);
      setProposals(proposalsData || []);
      setContracts(contractsData || []);
      setReports(reportsData || []);
    } catch (err: any) {
      console.error('Error fetching client data:', err);
      setError(err.message || 'Error al cargar los datos del cliente');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    if (session?.token) {
      try {
        await logoutClientPortal(session.token);
      } catch (err) {
        console.error('Error logging out:', err);
      }
    }
    
    localStorage.removeItem('clientPortalSession');
    navigate('/portal');
    toast.success('Sesión cerrada exitosamente');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Portal del Cliente</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="informes">
          <TabsList className="mb-8">
            <TabsTrigger value="informes">
              <FileText className="h-4 w-4 mr-2" />
              Informes
            </TabsTrigger>
            <TabsTrigger value="facturas">
              <CreditCard className="h-4 w-4 mr-2" />
              Facturas
            </TabsTrigger>
            <TabsTrigger value="propuestas">
              <ClipboardList className="h-4 w-4 mr-2" />
              Propuestas
            </TabsTrigger>
            <TabsTrigger value="cuenta">
              <User className="h-4 w-4 mr-2" />
              Cuenta
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="informes" className="space-y-6">
            <h2 className="text-2xl font-bold">Tus Informes</h2>
            <p className="text-muted-foreground">
              Aquí encontrarás todos los informes compartidos contigo.
            </p>
            
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map(report => (
                      <div key={report.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {format(new Date(report.created_at), 'dd/MM/yyyy')}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver informe
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay informes disponibles en este momento.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="facturas" className="space-y-6">
            <h2 className="text-2xl font-bold">Tus Facturas</h2>
            <p className="text-muted-foreground">
              Revisa tus facturas y su estado de pago.
            </p>
            
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : invoices.length > 0 ? (
                  <div className="space-y-4">
                    {invoices.map(invoice => (
                      <div key={invoice.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div>
                          <h3 className="font-medium">{invoice.title}</h3>
                          <div className="flex space-x-3 text-sm text-muted-foreground">
                            <span>{formatCurrency(invoice.amount)}</span>
                            <span>•</span>
                            <span>{getStatusBadge(invoice.status)}</span>
                            {invoice.due_date && (
                              <>
                                <span>•</span>
                                <span>Vence: {format(new Date(invoice.due_date), 'dd/MM/yyyy')}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Ver factura
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay facturas disponibles en este momento.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="propuestas" className="space-y-6">
            <h2 className="text-2xl font-bold">Propuestas</h2>
            <p className="text-muted-foreground">
              Revisa las propuestas de servicios.
            </p>
            
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : proposals.length > 0 ? (
                  <div className="space-y-4">
                    {proposals.map(proposal => (
                      <div key={proposal.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div>
                          <h3 className="font-medium">{proposal.title}</h3>
                          <div className="flex space-x-3 text-sm text-muted-foreground">
                            <span>{getStatusBadge(proposal.status)}</span>
                            <span>•</span>
                            <span>{format(new Date(proposal.created_at), 'dd/MM/yyyy')}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No hay propuestas disponibles en este momento.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cuenta" className="space-y-6">
            <h2 className="text-2xl font-bold">Tu Cuenta</h2>
            <p className="text-muted-foreground">
              Gestiona la información de tu cuenta.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">ID de cuenta:</p>
                  <p className="text-sm text-muted-foreground">{session?.account_id}</p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
  
  function getStatusBadge(status: string) {
    switch (status) {
      case 'paid':
      case 'accepted':
      case 'signed':
      case 'completed':
        return <Badge className="bg-green-500">Completado</Badge>;
      case 'pending':
      case 'sent':
      case 'in_progress':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'overdue':
      case 'delayed':
        return <Badge className="bg-red-500">Vencido</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  }
};

export default ClientPortalDashboard;
