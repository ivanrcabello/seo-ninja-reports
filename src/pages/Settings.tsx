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
import usePersistentState from '@/hooks/usePersistentState';
import { BRIGHT_DATA_CONFIG } from '@/services/seo-crawler/constants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  
  const [openAIKey, setOpenAIKey] = usePersistentState('openai_api_key', '');
  const [pageSpeedKey, setPageSpeedKey] = usePersistentState('pagespeed_api_key', '');
  const [valueSerpKey, setValueSerpKey] = usePersistentState('valueserp_api_key', '');

  useEffect(() => {
    const loadApiKeysFromDatabase = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('openai_key, google_key, value_serp_key')
          .limit(1)
          .single();
          
        if (error) {
          console.error('Error loading API keys from database:', error);
          return;
        }
        
        if (data) {
          if (data.openai_key && data.openai_key !== openAIKey) {
            setOpenAIKey(data.openai_key);
            localStorage.setItem('openai_api_key', data.openai_key);
            console.log('OpenAI API key loaded from database');
          }
          
          if (data.google_key && data.google_key !== pageSpeedKey) {
            setPageSpeedKey(data.google_key);
            localStorage.setItem('pagespeed_api_key', data.google_key);
            console.log('PageSpeed API key loaded from database');
          }
          
          if (data.value_serp_key && data.value_serp_key !== valueSerpKey) {
            setValueSerpKey(data.value_serp_key);
            localStorage.setItem('valueserp_api_key', data.value_serp_key);
            console.log('ValueSERP API key loaded from database');
          }
          
          if (
            (data.openai_key && data.openai_key !== openAIKey) ||
            (data.google_key && data.google_key !== pageSpeedKey) ||
            (data.value_serp_key && data.value_serp_key !== valueSerpKey)
          ) {
            toast.success('Claves API cargadas correctamente');
          }
        }
      } catch (error) {
        console.error('Error loading API keys:', error);
      }
    };
    
    if (user && !authLoading) {
      loadApiKeysFromDatabase();
    }
  }, [user, authLoading]);

  useEffect(() => {
    const loadPersistedData = () => {
      try {
        console.log('Loading persisted settings data');
      } catch (error) {
        console.error('Error loading persisted settings:', error);
      }
    };

    loadPersistedData();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Returned to Settings page, checking for state to restore');
        loadPersistedData();
      } else if (document.visibilityState === 'hidden') {
        console.log('Leaving Settings page, persisting current state');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    const handleBeforeUnload = () => {
      console.log('Page unloading, persisting settings state');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
                    openAIKey={openAIKey}
                    setOpenAIKey={setOpenAIKey}
                    pageSpeedKey={pageSpeedKey}
                    setPageSpeedKey={setPageSpeedKey}
                    valueSerpKey={valueSerpKey}
                    setValueSerpKey={setValueSerpKey}
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
