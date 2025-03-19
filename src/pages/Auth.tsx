
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const { user, loading } = useAuth();
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Redirect if already logged in
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const createAdminUser = async () => {
    try {
      setIsCreatingAdmin(true);
      
      const { data, error } = await supabase.functions.invoke('create-admin');
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success(data.message || 'Usuario administrador creado exitosamente');
    } catch (error: any) {
      console.error('Error al crear usuario administrador:', error);
      toast.error(error.message || 'Error al crear usuario administrador');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/5 to-transparent"></div>
      </div>
      
      <div className="w-full max-w-md">
        <AnimatedContainer animation="fade" className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">
              SoySeoLocal.com
            </span>
          </h1>
          <p className="text-muted-foreground">
            Inicia sesión o crea una nueva cuenta
          </p>

          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={createAdminUser}
              disabled={isCreatingAdmin}
              className="text-xs"
            >
              {isCreatingAdmin ? 'Creando...' : 'Crear Admin (ivan@soyseolocal.com)'}
            </Button>
          </div>
        </AnimatedContainer>
        
        <AuthForm />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Al iniciar sesión, aceptas nuestros
            <a href="#" className="text-primary hover:underline mx-1">Términos de Servicio</a>
            y
            <a href="#" className="text-primary hover:underline mx-1">Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
