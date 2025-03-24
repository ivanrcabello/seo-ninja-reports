
import React, { useState, useEffect } from 'react';
import OpenAISettings from './api/OpenAISettings';
import GoogleSettings from './api/GoogleSettings';
import ValueSerpSettings from './api/ValueSerpSettings';
import SettingsCard from './api/SettingsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersistentState } from '@/hooks/usePersistentState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApiSettingsProps {
  brightDataUsername: string;
  setBrightDataUsername: (username: string) => void;
  brightDataPassword: string;
  setBrightDataPassword: (password: string) => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({
  brightDataUsername,
  setBrightDataUsername,
  brightDataPassword,
  setBrightDataPassword
}) => {
  const [openaiKey, setOpenaiKey] = usePersistentState('openaiKey', '');
  const [googleKey, setGoogleKey] = usePersistentState('googleKey', '');
  const [valueSerpKey, setValueSerpKey] = usePersistentState('valueSerpKey', '');
  const [saving, setSaving] = useState(false);
  
  const [hasConfiguredOpenAI, setHasConfiguredOpenAI] = useState(false);
  const [hasConfiguredGoogle, setHasConfiguredGoogle] = useState(false);
  const [hasConfiguredValueSerp, setHasConfiguredValueSerp] = useState(false);

  // Get saved keys from Supabase on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('openai_key, google_key, value_serp_key')
          .eq('id', 1)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Detect if keys are configured
          setHasConfiguredOpenAI(!!data.openai_key);
          setHasConfiguredGoogle(!!data.google_key);
          setHasConfiguredValueSerp(!!data.value_serp_key);
          
          // Store keys in local state for display (masked)
          if (data.openai_key && !openaiKey) {
            setOpenaiKey(data.openai_key);
          }
          
          if (data.google_key && !googleKey) {
            setGoogleKey(data.google_key);
          }
          
          if (data.value_serp_key && !valueSerpKey) {
            setValueSerpKey(data.value_serp_key);
          }
        }
      } catch (error) {
        console.error('Error fetching API settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .update({
          openai_key: openaiKey,
          google_key: googleKey,
          value_serp_key: valueSerpKey,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
        
      if (error) throw error;
      
      toast.success('Configuración guardada correctamente');
      
      // Update configuration status
      setHasConfiguredOpenAI(!!openaiKey);
      setHasConfiguredGoogle(!!googleKey);
      setHasConfiguredValueSerp(!!valueSerpKey);
    } catch (error) {
      console.error('Error saving API settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <SettingsCard
      title="Configuración de APIs"
      description="Configura las claves de API necesarias para las funcionalidades de la plataforma."
      onSave={saveSettings}
      saving={saving}
    >
      <Tabs defaultValue="openai" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
          <TabsTrigger value="valueserp">Value SERP</TabsTrigger>
        </TabsList>
        
        <TabsContent value="openai">
          <OpenAISettings
            openaiKey={openaiKey}
            setOpenaiKey={setOpenaiKey}
            hasConfiguredOpenAI={hasConfiguredOpenAI}
          />
        </TabsContent>
        
        <TabsContent value="google">
          <GoogleSettings
            googleKey={googleKey}
            setGoogleKey={setGoogleKey}
            hasConfiguredGoogle={hasConfiguredGoogle}
          />
        </TabsContent>
        
        <TabsContent value="valueserp">
          <ValueSerpSettings
            valueSerpApiKey={valueSerpKey}
            setValueSerpApiKey={setValueSerpKey}
            hasConfiguredValueSerpKey={hasConfiguredValueSerp}
            brightDataUsername={brightDataUsername}
            setBrightDataUsername={setBrightDataUsername}
            brightDataPassword={brightDataPassword}
            setBrightDataPassword={setBrightDataPassword}
          />
        </TabsContent>
      </Tabs>
    </SettingsCard>
  );
};

export default ApiSettings;
