
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, User, Mail, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  website: string;
  phone_number?: string;
  industry?: string;
}

interface ClientAccount {
  id: string;
  email: string;
  client_id: string;
  last_login?: string;
}

interface ClientPortalAccountProps {
  clientId: string;
  accountId: string;
}

const ClientPortalAccount: React.FC<ClientPortalAccountProps> = ({ clientId, accountId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [account, setAccount] = useState<ClientAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load client and account data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Set client token in headers for this request
        const clientToken = localStorage.getItem('clientPortalSession') 
          ? JSON.parse(localStorage.getItem('clientPortalSession')!).token 
          : null;
          
        if (!clientToken) {
          throw new Error('Session token not found. Please log in again.');
        }
        
        const clientSupabase = supabase.from('clients').select('*').eq('id', clientId).single();
        const accountSupabase = supabase.from('client_portal_accounts').select('*').eq('id', accountId).single();
        
        // Add client token to both requests
        clientSupabase.headers({ 'x-client-token': clientToken });
        accountSupabase.headers({ 'x-client-token': clientToken });
        
        // Execute requests
        const [clientResponse, accountResponse] = await Promise.all([
          clientSupabase,
          accountSupabase
        ]);

        if (clientResponse.error) throw clientResponse.error;
        if (accountResponse.error) throw accountResponse.error;
        
        setClient(clientResponse.data);
        setAccount(accountResponse.data);
      } catch (err: any) {
        console.error('Error fetching account data:', err);
        setError('Error al cargar los datos de la cuenta. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, accountId]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    setIsChangingPassword(true);
    
    try {
      // Get client token from localStorage
      const clientToken = localStorage.getItem('clientPortalSession') 
        ? JSON.parse(localStorage.getItem('clientPortalSession')!).token 
        : null;
        
      if (!clientToken) {
        throw new Error('Session token not found. Please log in again.');
      }
      
      // Call the edge function with the client token in headers
      const { data, error } = await supabase.functions.invoke('change-client-password', {
        body: {
          accountId: accountId,
          currentPassword: currentPassword,
          newPassword: newPassword
        },
        headers: {
          'x-client-token': clientToken
        }
      });

      if (error) throw error;
      
      if (data && data.success) {
        toast.success('Contraseña actualizada correctamente');
        
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.');
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      toast.error('Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tu Cuenta</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tu Cuenta</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tu Cuenta</h2>
      <p className="text-muted-foreground">
        Gestiona la información de tu cuenta.
      </p>
      
      {/* Client Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" /> Información de la Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {client && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {client.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Sitio Web</Label>
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    {client.website}
                  </div>
                </div>
                {client.phone_number && (
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      {client.phone_number}
                    </div>
                  </div>
                )}
                {client.industry && (
                  <div className="space-y-2">
                    <Label>Industria</Label>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      {client.industry}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Para actualizar esta información, contacta con nosotros.
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Account Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" /> Información de la Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {account && (
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                {account.email}
              </div>
              {account.last_login && (
                <p className="text-sm text-muted-foreground">
                  Último acceso: {new Date(account.last_login).toLocaleDateString()} {new Date(account.last_login).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5" /> Cambiar Contraseña
          </CardTitle>
          <CardDescription>
            Actualiza tu contraseña de acceso al portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input 
                id="current-password" 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input 
                id="new-password" 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" disabled={isChangingPassword} className="w-full">
              {isChangingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortalAccount;
