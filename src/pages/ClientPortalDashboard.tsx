
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, FileText, CreditCard, ClipboardList, User, AlertCircle, Calendar, ChevronRight, Settings, ActivityLog } from 'lucide-react';
import { logoutClientPortal } from '@/services/clientPortalService';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ClientPortalReports from '@/components/client-portal/ClientPortalReports';
import ClientPortalInvoices from '@/components/client-portal/ClientPortalInvoices';
import ClientPortalProposals from '@/components/client-portal/ClientPortalProposals';
import ClientPortalContracts from '@/components/client-portal/ClientPortalContracts';
import ClientPortalAccount from '@/components/client-portal/ClientPortalAccount';
import LogsViewer from '@/components/client-portal/LogsViewer';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';

interface ClientPortalSession {
  account_id: string;
  client_id: string;
  token: string;
  expires_at: string;
}

const ClientPortalDashboard = () => {
  const [session, setSession] = useState<ClientPortalSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const storedSession = localStorage.getItem('clientPortalSession');
    
    if (!storedSession) {
      clientPortalLogger.warn('No session found, redirecting to login', null, 'ClientPortalDashboard');
      navigate('/portal');
      return;
    }
    
    try {
      const parsedSession = JSON.parse(storedSession) as ClientPortalSession;
      
      // Check if session is expired
      if (new Date(parsedSession.expires_at) < new Date()) {
        clientPortalLogger.warn('Session expired', { expires_at: parsedSession.expires_at }, 'ClientPortalDashboard');
        handleLogout();
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        return;
      }
      
      clientPortalLogger.info('Valid session loaded', { 
        accountId: parsedSession.account_id,
        clientId: parsedSession.client_id
      }, 'ClientPortalDashboard');
      
      setSession(parsedSession);
      setLoading(false);
    } catch (err) {
      console.error('Error parsing session:', err);
      clientPortalLogger.error('Error parsing session', err, 'ClientPortalDashboard');
      navigate('/portal');
    }
  }, [navigate]);
  
  const handleLogout = async () => {
    if (session?.token) {
      try {
        clientPortalLogger.info('Logging out', null, 'ClientPortalDashboard');
        await logoutClientPortal(session.token);
      } catch (err) {
        console.error('Error logging out:', err);
        clientPortalLogger.error('Error logging out', err, 'ClientPortalDashboard');
      }
    }
    
    localStorage.removeItem('clientPortalSession');
    navigate('/portal');
    toast.success('Sesión cerrada exitosamente');
  };

  const toggleLogs = () => {
    setShowLogs(!showLogs);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Portal del Cliente</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleLogs}>
              <ActivityLog className="h-4 w-4 mr-2" />
              {showLogs ? 'Ocultar Logs' : 'Ver Logs'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showLogs && <div className="mb-8"><LogsViewer /></div>}

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        ) : (
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
              <TabsTrigger value="contratos">
                <ClipboardList className="h-4 w-4 mr-2" />
                Contratos
              </TabsTrigger>
              <TabsTrigger value="cuenta">
                <User className="h-4 w-4 mr-2" />
                Cuenta
              </TabsTrigger>
            </TabsList>
            
            {/* Content for each tab */}
            {session && (
              <>
                <TabsContent value="informes">
                  <ClientPortalReports clientId={session.client_id} />
                </TabsContent>
                
                <TabsContent value="facturas">
                  <ClientPortalInvoices clientId={session.client_id} />
                </TabsContent>
                
                <TabsContent value="propuestas">
                  <ClientPortalProposals clientId={session.client_id} />
                </TabsContent>
                
                <TabsContent value="contratos">
                  <ClientPortalContracts clientId={session.client_id} />
                </TabsContent>
                
                <TabsContent value="cuenta">
                  <ClientPortalAccount clientId={session.client_id} accountId={session.account_id} />
                </TabsContent>
              </>
            )}
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default ClientPortalDashboard;
