
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, FileText, CreditCard, ClipboardList, User, Loader2 } from 'lucide-react';
import { logoutClientPortal } from '@/services/clientPortalService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ClientPortalSession {
  account_id: string;
  client_id: string;
  token: string;
  expires_at: string;
}

interface ClientData {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  phone_number?: string;
}

interface SharedDocument {
  id: string;
  title: string;
  type: 'report' | 'proposal' | 'contract' | 'invoice';
  status: string;
  date: string;
  shared_url: string;
}

const ClientPortalDashboard = () => {
  const [session, setSession] = useState<ClientPortalSession | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [reports, setReports] = useState<SharedDocument[]>([]);
  const [proposals, setProposals] = useState<SharedDocument[]>([]);
  const [contracts, setContracts] = useState<SharedDocument[]>([]);
  const [invoices, setInvoices] = useState<SharedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      fetchClientData(parsedSession.client_id);
    } catch (err) {
      console.error('Error parsing session:', err);
      navigate('/portal');
    }
  }, [navigate]);

  const fetchClientData = async (clientId: string) => {
    setIsLoading(true);
    try {
      // Fetch client data
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id, name, website, industry, phone_number')
        .eq('id', clientId)
        .single();
      
      if (clientError) throw clientError;
      setClientData(client);
      
      // Fetch shared documents
      await Promise.all([
        fetchSharedDocuments(clientId, 'report', setReports),
        fetchSharedDocuments(clientId, 'proposal', setProposals),
        fetchSharedDocuments(clientId, 'contract', setContracts),
        fetchSharedDocuments(clientId, 'invoice', setInvoices)
      ]);
      
    } catch (err) {
      console.error('Error fetching client data:', err);
      toast.error('Error al cargar datos del cliente');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSharedDocuments = async (
    clientId: string, 
    type: 'report' | 'proposal' | 'contract' | 'invoice',
    setData: React.Dispatch<React.SetStateAction<SharedDocument[]>>
  ) => {
    try {
      let query;
      
      if (type === 'report') {
        const { data, error } = await supabase
          .from('reports')
          .select('id, title, status, created_at, shared_url')
          .eq('client_id', clientId)
          .not('shared_url', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'report' as const,
          status: item.status,
          date: item.created_at,
          shared_url: item.shared_url
        }));
        
        setData(formattedData);
      }
      
      else if (type === 'proposal') {
        const { data, error } = await supabase
          .from('client_proposals')
          .select('id, title, status, created_at, shared_url')
          .eq('client_id', clientId)
          .not('shared_url', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'proposal' as const,
          status: item.status,
          date: item.created_at,
          shared_url: item.shared_url
        }));
        
        setData(formattedData);
      }
      
      else if (type === 'contract') {
        const { data, error } = await supabase
          .from('client_contracts')
          .select('id, title, status, created_at, shared_url')
          .eq('client_id', clientId)
          .not('shared_url', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'contract' as const,
          status: item.status,
          date: item.created_at,
          shared_url: item.shared_url
        }));
        
        setData(formattedData);
      }
      
      else if (type === 'invoice') {
        const { data, error } = await supabase
          .from('client_invoices')
          .select('id, title, status, created_at, shared_url')
          .eq('client_id', clientId)
          .not('shared_url', 'is', null)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const formattedData = data.map(item => ({
          id: item.id,
          title: item.title,
          type: 'invoice' as const,
          status: item.status,
          date: item.created_at,
          shared_url: item.shared_url
        }));
        
        setData(formattedData);
      }
      
    } catch (err) {
      console.error(`Error fetching ${type}s:`, err);
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

  const getShareUrl = (doc: SharedDocument) => {
    const baseUrl = window.location.origin;
    
    if (doc.type === 'report') {
      return `${baseUrl}/shared/reports/${doc.shared_url}`;
    } else if (doc.type === 'proposal') {
      return `${baseUrl}/shared/proposals/${doc.shared_url}`;
    } else if (doc.type === 'contract') {
      return `${baseUrl}/shared/contracts/${doc.shared_url}`;
    } else if (doc.type === 'invoice') {
      return `${baseUrl}/shared/invoices/${doc.shared_url}`;
    }
    
    return '#';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Cargando datos...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Portal del Cliente</h1>
            {clientData && (
              <span className="ml-2 text-sm text-muted-foreground">
                | {clientData.name}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {clientData && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Nombre:</p>
                    <p className="text-sm text-muted-foreground">{clientData.name}</p>
                  </div>
                  {clientData.website && (
                    <div>
                      <p className="text-sm font-medium">Sitio web:</p>
                      <p className="text-sm text-muted-foreground">
                        <a href={clientData.website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-500 hover:underline">
                          {clientData.website}
                        </a>
                      </p>
                    </div>
                  )}
                  {clientData.industry && (
                    <div>
                      <p className="text-sm font-medium">Industria:</p>
                      <p className="text-sm text-muted-foreground">{clientData.industry}</p>
                    </div>
                  )}
                  {clientData.phone_number && (
                    <div>
                      <p className="text-sm font-medium">Teléfono:</p>
                      <p className="text-sm text-muted-foreground">{clientData.phone_number}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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
                {reports.length > 0 ? (
                  <div className="divide-y">
                    {reports.map(report => (
                      <div key={report.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={getShareUrl(report)} target="_blank" rel="noopener noreferrer">
                            Ver informe
                          </a>
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
                {invoices.length > 0 ? (
                  <div className="divide-y">
                    {invoices.map(invoice => (
                      <div key={invoice.id} className="py-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{invoice.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {invoice.status === 'paid' ? 'Pagada' :
                               invoice.status === 'pending' ? 'Pendiente' :
                               invoice.status === 'overdue' ? 'Vencida' : 'Cancelada'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={getShareUrl(invoice)} target="_blank" rel="noopener noreferrer">
                            Ver factura
                          </a>
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
                {proposals.length > 0 ? (
                  <div className="divide-y">
                    {proposals.map(proposal => (
                      <div key={proposal.id} className="py-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{proposal.title}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              proposal.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {proposal.status === 'accepted' ? 'Aceptada' :
                               proposal.status === 'sent' ? 'Enviada' :
                               proposal.status === 'rejected' ? 'Rechazada' : 'Borrador'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(proposal.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={getShareUrl(proposal)} target="_blank" rel="noopener noreferrer">
                            Ver propuesta
                          </a>
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
};

export default ClientPortalDashboard;
