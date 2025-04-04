
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authenticateClientPortal } from '@/services/clientPortalService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Users, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const ClientPortal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
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
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Por favor, ingrese su email y contraseña');
      setLoading(false);
      return;
    }

    try {
      console.log('Sending login request for:', email);
      const session = await authenticateClientPortal(email, password);
      
      if (!session) {
        console.log('No session returned from auth');
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
        return;
      }
      
      console.log('Login successful, session:', session);
      
      // Store session in localStorage
      localStorage.setItem('clientPortalSession', JSON.stringify(session));
      
      // Redirect to dashboard
      toast.success('Inicio de sesión exitoso');
      navigate('/portal/dashboard');
    } catch (err: any) {
      console.error('Login error details:', err);
      setError(err.message || 'Error al iniciar sesión. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
              SoySeoLocal
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <p className="font-medium">Portal del Cliente</p>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Accede a tus informes, facturas y contenido personalizado
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
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
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : 'Iniciar Sesión'}
              </Button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                ¿Eres administrador? 
                <Link to="/auth" className="text-primary hover:underline mx-1">
                  Acceso administración
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Si no tienes credenciales de acceso, contacta con tu agencia.
        </p>
      </div>
    </div>
  );
};

export default ClientPortal;
