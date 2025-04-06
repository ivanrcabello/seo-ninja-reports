
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { OpenAISettings } from './api/OpenAISettings';
import GoogleSettings from './api/GoogleSettings';
import ValueSerpSettings from './api/ValueSerpSettings';
import { usePersistentState } from '@/hooks/usePersistentState';
import { toast } from 'sonner';
import { BRIGHT_DATA_CONFIG } from '@/services/seo-crawler/constants';

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
  const [openAiApiKey, setOpenAiApiKey] = usePersistentState('openai_api_key', '');
  const [googleApiKey, setGoogleApiKey] = usePersistentState('google_pagespeed_api_key', '');
  const [valueSerpApiKey, setValueSerpApiKey] = usePersistentState('valueserp_api_key', '');
  const [defaultPrompt, setDefaultPrompt] = usePersistentState('default_seo_prompt', '');
  const [brightDataApiKey, setBrightDataApiKey] = usePersistentState('bright_data_api_key', '');

  const hasConfiguredOpenAiKey = !!openAiApiKey;
  const hasConfiguredGoogle = !!googleApiKey;
  const hasConfiguredValueSerpKey = !!valueSerpApiKey;

  // Load Bright Data credentials from localStorage if we received empty values
  useEffect(() => {
    const savedUsername = localStorage.getItem('bright_data_username');
    const savedPassword = localStorage.getItem('bright_data_password');
    const savedApiKey = localStorage.getItem('bright_data_api_key');
    
    console.log('Loading saved Bright Data credentials from localStorage');
    console.log('Saved username exists:', !!savedUsername);
    console.log('Saved password exists:', !!savedPassword);
    console.log('Saved API key exists:', !!savedApiKey);
    
    if (savedUsername && (!brightDataUsername || brightDataUsername === BRIGHT_DATA_CONFIG.DEFAULT_USER)) {
      console.log('Setting saved username from localStorage');
      setBrightDataUsername(savedUsername);
    } else if (!brightDataUsername) {
      console.log('Setting default username from config');
      setBrightDataUsername(BRIGHT_DATA_CONFIG.DEFAULT_USER);
    }
    
    if (savedPassword && (!brightDataPassword || brightDataPassword === BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD)) {
      console.log('Setting saved password from localStorage');
      setBrightDataPassword(savedPassword);
    } else if (!brightDataPassword) {
      console.log('Setting default password from config');
      setBrightDataPassword(BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD);
    }
    
    if (savedApiKey) {
      console.log('Setting saved API key from localStorage');
      setBrightDataApiKey(savedApiKey);
    }
  }, []);

  const handleSave = () => {
    // Ensure Bright Data credentials are saved to localStorage
    const usernameToSave = brightDataUsername || BRIGHT_DATA_CONFIG.DEFAULT_USER;
    const passwordToSave = brightDataPassword || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD;
    
    localStorage.setItem('bright_data_username', usernameToSave);
    localStorage.setItem('bright_data_password', passwordToSave);
    
    if (brightDataApiKey) {
      localStorage.setItem('bright_data_api_key', brightDataApiKey);
      console.log('Saved Bright Data API key to localStorage');
    }
    
    console.log('Saved Bright Data credentials to localStorage');
    console.log('Username saved:', usernameToSave.substring(0, 10) + '...');
    console.log('Password saved:', passwordToSave ? '*** (set)' : '(not set)');
    console.log('API key saved:', brightDataApiKey ? '*** (set)' : '(not set)');
    
    toast.success('Configuración guardada correctamente');
  };

  return (
    <Tabs defaultValue="openai" className="space-y-4">
      <TabsList>
        <TabsTrigger value="openai">OpenAI</TabsTrigger>
        <TabsTrigger value="google">Google</TabsTrigger>
        <TabsTrigger value="valueserp">Value SERP</TabsTrigger>
        <TabsTrigger value="brightdata">Bright Data</TabsTrigger>
      </TabsList>
      <TabsContent value="openai">
        <Card className="bg-background/50 border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">OpenAI</CardTitle>
            <CardDescription>Configura tu clave API de OpenAI para generar informes SEO.</CardDescription>
          </CardHeader>
          <CardContent>
            <OpenAISettings
              apiKey={openAiApiKey}
              setApiKey={setOpenAiApiKey}
              defaultPrompt={defaultPrompt}
              setDefaultPrompt={setDefaultPrompt}
              hasConfiguredKey={hasConfiguredOpenAiKey}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="google">
        <Card className="bg-background/50 border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Google PageSpeed Insights</CardTitle>
            <CardDescription>Configura tu clave API de Google para analizar sitios web con PageSpeed Insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleSettings
              googleApiKey={googleApiKey}
              setGoogleKey={setGoogleApiKey}
              hasConfiguredGoogle={hasConfiguredGoogle}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="valueserp">
        <Card className="bg-background/50 border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Value SERP</CardTitle>
            <CardDescription>Configura tu clave API de Value SERP para análisis de perfiles de negocio.</CardDescription>
          </CardHeader>
          <CardContent>
            <ValueSerpSettings
              valueSerpApiKey={valueSerpApiKey}
              setValueSerpApiKey={setValueSerpApiKey}
              hasConfiguredValueSerpKey={hasConfiguredValueSerpKey}
              brightDataUsername={brightDataUsername}
              setBrightDataUsername={setBrightDataUsername}
              brightDataPassword={brightDataPassword}
              setBrightDataPassword={setBrightDataPassword}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="brightdata">
        <Card className="bg-background/50 border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Bright Data</CardTitle>
            <CardDescription>Configura tus credenciales para el servicio de rastreo SEO.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brightDataUsername">Usuario de Bright Data</Label>
                <Input
                  id="brightDataUsername"
                  type="text"
                  value={brightDataUsername}
                  onChange={(e) => setBrightDataUsername(e.target.value)}
                  className="glass-input"
                  placeholder={BRIGHT_DATA_CONFIG.DEFAULT_USER}
                />
                <p className="text-xs text-muted-foreground">
                  Tu usuario de Bright Data para rastreo SEO. <br />
                  Valor por defecto: {BRIGHT_DATA_CONFIG.DEFAULT_USER}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brightDataPassword">Contraseña de Bright Data</Label>
                <Input
                  id="brightDataPassword"
                  type="password"
                  value={brightDataPassword}
                  onChange={(e) => setBrightDataPassword(e.target.value)}
                  className="glass-input"
                  placeholder={BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD}
                />
                <p className="text-xs text-muted-foreground">
                  Tu contraseña de Bright Data para rastreo SEO. <br />
                  Valor por defecto: {BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brightDataApiKey">API Key de Bright Data</Label>
                <Input
                  id="brightDataApiKey"
                  type="password"
                  value={brightDataApiKey}
                  onChange={(e) => setBrightDataApiKey(e.target.value)}
                  className="glass-input"
                  placeholder="Introduce tu API Key de Bright Data"
                />
                <p className="text-xs text-muted-foreground">
                  Tu API Key de Bright Data para rastreo SEO. <br />
                  Ejemplo: 16dc9468b0aafcdaf27d0e878e71e079b2db99792012e1a1d9cf79ed2265230b
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Información de conexión:</Label>
                <div className="bg-muted p-3 rounded-md text-sm font-mono">
                  <p>Host: {BRIGHT_DATA_CONFIG.PROXY_HOST}</p>
                  <p>Puerto: {BRIGHT_DATA_CONFIG.PROXY_PORT}</p>
                </div>
              </div>
              
              <Button 
                onClick={handleSave}
                className="w-full"
              >
                Guardar credenciales
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

// We need to import the Label and Input components
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default ApiSettings;
