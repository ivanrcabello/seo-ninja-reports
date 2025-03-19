
import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ApiSettings from '@/components/settings/ApiSettings';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import useAuth from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const { user, loading: authLoading } = useAuth();

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 sm:px-6 mx-auto">
          <AnimatedContainer animation="slide-up" className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Configuración</h1>
            <p className="text-muted-foreground">
              Gestiona las configuraciones de API y generación de informes
            </p>
          </AnimatedContainer>
          
          {authLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <AnimatedContainer animation="fade" delay={200}>
              <ApiSettings />
            </AnimatedContainer>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
