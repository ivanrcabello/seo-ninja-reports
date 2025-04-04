
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authenticateClientPortal } from '@/services/clientPortalService';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';

const ClientPortalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const storedSession = localStorage.getItem('clientPortalSession');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (new Date(session.expires_at) > new Date()) {
          // Session is valid, redirect to dashboard
          navigate('/portal/dashboard');
        } else {
          // Session is expired, remove it
          localStorage.removeItem('clientPortalSession');
        }
      } catch (err) {
        console.error('Error parsing stored session:', err);
        localStorage.removeItem('clientPortalSession');
      }
    }
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Authenticating with email:', email);
      const session = await authenticateClientPortal(email, password);
      
      if (!session) {
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
        setIsLoading(false);
        return;
      }
      
      console.log('Authentication successful:', session);
      
      // Save session to localStorage
      localStorage.setItem('clientPortalSession', JSON.stringify(session));
      
      // Redirect to dashboard
      navigate('/portal/dashboard');
      toast.success('Inicio de sesión exitoso');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
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
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
