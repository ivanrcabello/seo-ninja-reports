
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ApiSettings from '@/components/settings/ApiSettings';
import LogoUpload from '@/components/settings/LogoUpload';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

const Settings = () => {
  const { user, loading: authLoading } = useAuth();

  // Handle visibility changes to ensure page state is preserved
  useEffect(() => {
    // Load persisted form data from local storage
    const loadPersistedData = () => {
      try {
        console.log('Loading persisted settings data');
        // We're using the usePersistentState hook in child components
        // so we don't need to do anything here
      } catch (error) {
        console.error('Error loading persisted settings:', error);
      }
    };

    // Initial load
    loadPersistedData();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When returning to the tab, check if we need to restore any state
        console.log('Returned to Settings page, checking for state to restore');
        loadPersistedData();
      } else if (document.visibilityState === 'hidden') {
        // When leaving the tab, persist important state
        console.log('Leaving Settings page, persisting current state');
        // The child components handle their own state persistence
      }
    };

    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Handle unload events to persist data
    const handleBeforeUnload = () => {
      console.log('Page unloading, persisting settings state');
      // The child components handle their own state persistence
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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

          <AnimatedContainer animation="slide-up" delay={100} className="mb-6">
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Para aprovechar todas las funcionalidades, configura las APIs necesarias.
                OpenAI es obligatoria para la generación de informes. Google PageSpeed
                es opcional pero añade funcionalidades adicionales.
              </AlertDescription>
            </Alert>
          </AnimatedContainer>
          
          {authLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <AnimatedContainer animation="fade" delay={200}>
              <div className="grid grid-cols-1 gap-8">
                <LogoUpload />
                <ApiSettings />
              </div>
            </AnimatedContainer>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
