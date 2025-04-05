
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

  const hasConfiguredOpenAiKey = !!openAiApiKey;
  const hasConfiguredGoogle = !!googleApiKey;
  const hasConfiguredValueSerpKey = !!valueSerpApiKey;

  const handleSave = () => {
    toast.success('Configuración guardada correctamente');
  };

  return (
    <Tabs defaultValue="openai" className="space-y-4">
      <TabsList>
        <TabsTrigger value="openai">OpenAI</TabsTrigger>
        <TabsTrigger value="google">Google</TabsTrigger>
        <TabsTrigger value="valueserp">Value SERP</TabsTrigger>
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
            <CardTitle className="text-lg font-medium">Value SERP y Bright Data</CardTitle>
            <CardDescription>Configura tus credenciales para los servicios de rastreo SEO.</CardDescription>
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
    </Tabs>
  );
};

export default ApiSettings;
