
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingsCard from './api/SettingsCard';
import GoogleSettings from './api/GoogleSettings';
import { OpenAISettings, DEFAULT_PROMPT } from './api/OpenAISettings';

const ApiSettings = () => {
  const [activeTab, setActiveTab] = useState('openai');
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('openai_api_key') || '';
  });
  
  const [googleApiKey, setGoogleApiKey] = useState(() => {
    return localStorage.getItem('google_pagespeed_api_key') || '';
  });
  
  const [defaultPrompt, setDefaultPrompt] = useState(() => {
    return localStorage.getItem('default_seo_prompt') || DEFAULT_PROMPT;
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [hasConfiguredKey, setHasConfiguredKey] = useState(false);
  const [hasConfiguredGoogleKey, setHasConfiguredGoogleKey] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    const storedGoogleKey = localStorage.getItem('google_pagespeed_api_key');
    
    setHasConfiguredKey(!!storedKey && storedKey.trim() !== '');
    setHasConfiguredGoogleKey(!!storedGoogleKey && storedGoogleKey.trim() !== '');
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      if (activeTab === 'openai') {
        if (!apiKey.trim()) {
          toast.error('Debes proporcionar una API key de OpenAI válida');
          setIsSaving(false);
          return;
        }
        
        localStorage.setItem('openai_api_key', apiKey);
        localStorage.setItem('default_seo_prompt', defaultPrompt);
        setHasConfiguredKey(true);
        toast.success('Configuración de OpenAI guardada correctamente');
      } else if (activeTab === 'google') {
        if (!googleApiKey.trim()) {
          toast.error('Debes proporcionar una API key de Google válida');
          setIsSaving(false);
          return;
        }
        
        localStorage.setItem('google_pagespeed_api_key', googleApiKey);
        setHasConfiguredGoogleKey(true);
        toast.success('Configuración de Google PageSpeed API guardada correctamente');
      }
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsCard 
      title="Configuración de API"
      description="Configura las APIs necesarias para la generación de informes SEO"
      isSaving={isSaving}
      onSave={handleSave}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="google">Google PageSpeed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="openai">
          <OpenAISettings 
            apiKey={apiKey}
            setApiKey={setApiKey}
            defaultPrompt={defaultPrompt}
            setDefaultPrompt={setDefaultPrompt}
            hasConfiguredKey={hasConfiguredKey}
            onSave={handleSave}
          />
        </TabsContent>
        
        <TabsContent value="google">
          <GoogleSettings 
            googleApiKey={googleApiKey}
            setGoogleApiKey={setGoogleApiKey}
            hasConfiguredGoogleKey={hasConfiguredGoogleKey}
          />
        </TabsContent>
      </Tabs>
    </SettingsCard>
  );
};

export default ApiSettings;
