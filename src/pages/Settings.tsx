
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ApiSettings from '@/components/settings/ApiSettings';
import LogoUpload from '@/components/settings/LogoUpload';
import SeoSettings from '@/components/settings/SeoSettings';
import ResetSystem from '@/components/settings/ResetSystem';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersistentState } from '@/hooks/usePersistentState';
import { BRIGHT_DATA_CONFIG } from '@/services/seo-crawler/constants';

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const [brightDataUsername, setBrightDataUsername] = usePersistentState(
    'bright_data_username', 
    BRIGHT_DATA_CONFIG.DEFAULT_USER
  );
  const [brightDataPassword, setBrightDataPassword] = usePersistentState(
    'bright_data_password',
    BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD
  );
  const [brightDataApiKey, setBrightDataApiKey] = usePersistentState(
    'bright_data_api_key',
    BRIGHT_DATA_CONFIG.DEFAULT_API_KEY
  );

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
              Gestiona las configuraciones del sistema y contenido del sitio web
            </p>
          </AnimatedContainer>

          <AnimatedContainer animation="slide-up" delay={100} className="mb-6">
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Para aprovechar todas las funcionalidades, configura las APIs necesarias.
                OpenAI es obligatoria para la generación de informes. Google PageSpeed
                es opcional pero añade funcionalidades adicionales. Bright Data es necesaria
                para el análisis SEO técnico.
              </AlertDescription>
            </Alert>
          </AnimatedContainer>
          
          {authLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <AnimatedContainer animation="fade" delay={200}>
              <Tabs defaultValue="apis" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="apis">APIs</TabsTrigger>
                  <TabsTrigger value="branding">Marca</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="system">Sistema</TabsTrigger>
                </TabsList>
                
                <TabsContent value="apis" className="space-y-4">
                  <ApiSettings 
                    brightDataUsername={brightDataUsername}
                    setBrightDataUsername={setBrightDataUsername}
                    brightDataPassword={brightDataPassword}
                    setBrightDataPassword={setBrightDataPassword}
                    brightDataApiKey={brightDataApiKey}
                    setBrightDataApiKey={setBrightDataApiKey}
                  />
                </TabsContent>
                
                <TabsContent value="branding">
                  <LogoUpload />
                </TabsContent>
                
                <TabsContent value="seo">
                  <SeoSettings />
                </TabsContent>
                
                <TabsContent value="system" className="space-y-4">
                  <ResetSystem />
                </TabsContent>
              </Tabs>
            </AnimatedContainer>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
