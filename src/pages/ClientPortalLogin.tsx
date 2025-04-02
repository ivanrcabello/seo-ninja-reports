
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authenticateClientPortal } from '@/services/clientPortalService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ClientPortalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const session = await authenticateClientPortal(email, password);
      
      if (!session) {
        toast.error('Credenciales inválidas');
        return;
      }
      
      // Save session to localStorage
      localStorage.setItem('clientPortalSession', JSON.stringify(session));
      
      // Redirect to dashboard
      navigate('/portal/dashboard');
      toast.success('Inicio de sesión exitoso');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Portal de Cliente</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="nombre@ejemplo.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accediendo...
                </>
              ) : (
                'Acceder'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ClientPortalLogin;
