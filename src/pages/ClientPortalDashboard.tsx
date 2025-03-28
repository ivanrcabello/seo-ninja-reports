
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, FileText, CreditCard, ClipboardList, User } from 'lucide-react';
import { logoutClientPortal } from '@/services/clientPortalService';
import { toast } from 'sonner';

interface ClientPortalSession {
  account_id: string;
  client_id: string;
  token: string;
  expires_at: string;
}

const ClientPortalDashboard = () => {
  const [session, setSession] = useState<ClientPortalSession | null>(null);
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
    } catch (err) {
      console.error('Error parsing session:', err);
      navigate('/portal');
    }
  }, [navigate]);
  
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
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }
  
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
                <p className="text-center text-muted-foreground py-8">
                  No hay informes disponibles en este momento.
                </p>
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
                <p className="text-center text-muted-foreground py-8">
                  No hay facturas disponibles en este momento.
                </p>
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
                <p className="text-center text-muted-foreground py-8">
                  No hay propuestas disponibles en este momento.
                </p>
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
                  <p className="text-sm text-muted-foreground">{session.account_id}</p>
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
