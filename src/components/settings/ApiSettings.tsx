
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OpenAISettings, DEFAULT_PROMPT } from './api/OpenAISettings';
import GoogleSettings from './api/GoogleSettings';
import ValueSerpSettings from './api/ValueSerpSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import usePersistentState from '@/hooks/usePersistentState';

const ApiSettings = () => {
  // Use persistent state for all settings
  const [apiKey, setApiKey] = usePersistentState<string>('openai_api_key', '');
  const [defaultPrompt, setDefaultPrompt] = usePersistentState<string>('default_seo_prompt', DEFAULT_PROMPT);
  const [googleApiKey, setGoogleApiKey] = usePersistentState<string>('google_api_key', '');
  const [valueSerpApiKey, setValueSerpApiKey] = usePersistentState<string>('value_serp_api_key', '');
  
  // State for tracking configuration status
  const [hasConfiguredKey, setHasConfiguredKey] = useState(false);
  const [hasConfiguredGoogleKey, setHasConfiguredGoogleKey] = useState(false);
  const [hasConfiguredValueSerpKey, setHasConfiguredValueSerpKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch API settings from Supabase
      const { data, error } = await supabase
        .from('settings')
        .select('openai_key, google_key, default_prompt, value_serp_key')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      // Set OpenAI settings
      if (data?.openai_key) {
        setApiKey(data.openai_key);
        setHasConfiguredKey(true);
      }
      
      // Set Google settings
      if (data?.google_key) {
        setGoogleApiKey(data.google_key);
        setHasConfiguredGoogleKey(true);
      }
      
      // Set ValueSerp settings
      if (data?.value_serp_key) {
        setValueSerpApiKey(data.value_serp_key);
        setHasConfiguredValueSerpKey(true);
      }
      
      // Set default prompt if available
      if (data?.default_prompt) {
        setDefaultPrompt(data.default_prompt);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('settings')
        .update({
          openai_key: apiKey,
          google_key: googleApiKey,
          value_serp_key: valueSerpApiKey,
          default_prompt: defaultPrompt
        })
        .eq('id', 1);

      if (error) {
        throw error;
      }

      // Update configured state based on current values
      setHasConfiguredKey(!!apiKey);
      setHasConfiguredGoogleKey(!!googleApiKey);
      setHasConfiguredValueSerpKey(!!valueSerpApiKey);

      // Also save to localStorage as backup
      localStorage.setItem('openai_api_key', apiKey);
      localStorage.setItem('google_api_key', googleApiKey);
      localStorage.setItem('value_serp_api_key', valueSerpApiKey);
      localStorage.setItem('default_seo_prompt', defaultPrompt);

      toast.success('Configuración guardada correctamente');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Tabs defaultValue="apis" className="space-y-4">
      <TabsList>
        <TabsTrigger value="apis">APIs Externas</TabsTrigger>
        <TabsTrigger value="customization">Personalización</TabsTrigger>
      </TabsList>
      
      <TabsContent value="apis" className="space-y-4">
        <OpenAISettings 
          apiKey={apiKey}
          setApiKey={setApiKey}
          defaultPrompt={defaultPrompt}
          setDefaultPrompt={setDefaultPrompt}
          hasConfiguredKey={hasConfiguredKey}
          onSave={handleSaveSettings}
        />
        <GoogleSettings 
          googleApiKey={googleApiKey}
          setGoogleApiKey={setGoogleApiKey}
          hasConfiguredGoogleKey={hasConfiguredGoogleKey}
        />
        <ValueSerpSettings
          valueSerpApiKey={valueSerpApiKey}
          setValueSerpApiKey={setValueSerpApiKey}
          hasConfiguredValueSerpKey={hasConfiguredValueSerpKey}
        />

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Guardar configuración'}
          </button>
        </div>
      </TabsContent>
      
      <TabsContent value="customization" className="space-y-4">
        {/* No need to include LogoUpload here as it's already in the main settings page */}
      </TabsContent>
    </Tabs>
  );
};

export default ApiSettings;
