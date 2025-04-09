
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ValueSerpSettings from './ValueSerpSettings';
import { usePersistentState } from '@/hooks/usePersistentState';
import { BRIGHT_DATA_CONFIG } from '@/services/seo-crawler/constants';
import OpenAITabContent from './tabs/OpenAITabContent';
import PageSpeedTabContent from './tabs/PageSpeedTabContent';
import BrightDataTabContent from './tabs/BrightDataTabContent';

interface ApiSettingsProps {
  brightDataUsername?: string;
  setBrightDataUsername?: (value: string) => void;
  brightDataPassword?: string;
  setBrightDataPassword?: (value: string) => void;
  brightDataApiKey?: string;
  setBrightDataApiKey?: (value: string) => void;
  
  openAIKey?: string;
  setOpenAIKey?: (value: string) => void;
  pageSpeedKey?: string;
  setPageSpeedKey?: (value: string) => void;
  valueSerpKey?: string;
  setValueSerpKey?: (value: string) => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({
  brightDataUsername: propsBrightDataUsername,
  setBrightDataUsername: propSetBrightDataUsername,
  brightDataPassword: propsBrightDataPassword,
  setBrightDataPassword: propSetBrightDataPassword,
  brightDataApiKey: propsBrightDataApiKey,
  setBrightDataApiKey: propSetBrightDataApiKey,
  openAIKey: propsOpenAIKey,
  setOpenAIKey: propsSetOpenAIKey,
  pageSpeedKey: propsPageSpeedKey,
  setPageSpeedKey: propsSetPageSpeedKey,
  valueSerpKey: propsValueSerpKey,
  setValueSerpKey: propsSetValueSerpKey
}) => {
  // Use persistent state for better state management
  const [openAIKey, setOpenAIKey] = usePersistentState('openai_api_key', propsOpenAIKey || '');
  const [pageSpeedKey, setPageSpeedKey] = usePersistentState('pagespeed_api_key', propsPageSpeedKey || '');
  
  const [brightDataUsername, setBrightDataUsername] = usePersistentState(
    'bright_data_username',
    propsBrightDataUsername || BRIGHT_DATA_CONFIG.DEFAULT_USER
  );
  const [brightDataPassword, setBrightDataPassword] = usePersistentState(
    'bright_data_password',
    propsBrightDataPassword || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD
  );
  const [brightDataApiKey, setBrightDataApiKey] = usePersistentState(
    'bright_data_api_key',
    propsBrightDataApiKey || BRIGHT_DATA_CONFIG.DEFAULT_API_KEY
  );
  
  const [valueSerpApiKey, setValueSerpApiKey] = usePersistentState(
    'valueserp_api_key',
    propsValueSerpKey || ''
  );
  
  // Sync the local state with props
  useEffect(() => {
    if (propsBrightDataUsername) {
      setBrightDataUsername(propsBrightDataUsername);
    }
    if (propsBrightDataPassword) {
      setBrightDataPassword(propsBrightDataPassword);
    }
    if (propsBrightDataApiKey) {
      setBrightDataApiKey(propsBrightDataApiKey);
    }
    
    if (propsOpenAIKey && propsSetOpenAIKey) {
      setOpenAIKey(propsOpenAIKey);
    }
    if (propsPageSpeedKey && propsSetPageSpeedKey) {
      setPageSpeedKey(propsPageSpeedKey);
    }
    if (propsValueSerpKey) {
      setValueSerpApiKey(propsValueSerpKey);
    }
  }, [
    propsBrightDataUsername, propsBrightDataPassword, propsBrightDataApiKey,
    propsOpenAIKey, propsPageSpeedKey, propsValueSerpKey
  ]);
  
  // Sync props with local state
  useEffect(() => {
    if (openAIKey !== propsOpenAIKey && propsSetOpenAIKey) {
      propsSetOpenAIKey(openAIKey);
    }
    if (pageSpeedKey !== propsPageSpeedKey && propsSetPageSpeedKey) {
      propsSetPageSpeedKey(pageSpeedKey);
    }
    if (valueSerpApiKey !== propsValueSerpKey && propsSetValueSerpKey) {
      propsSetValueSerpKey(valueSerpApiKey);
    }
    if (brightDataUsername !== propsBrightDataUsername && propSetBrightDataUsername) {
      propSetBrightDataUsername(brightDataUsername);
    }
    if (brightDataPassword !== propsBrightDataPassword && propSetBrightDataPassword) {
      propSetBrightDataPassword(brightDataPassword);
    }
    if (brightDataApiKey !== propsBrightDataApiKey && propSetBrightDataApiKey) {
      propSetBrightDataApiKey(brightDataApiKey);
    }
  }, [openAIKey, pageSpeedKey, valueSerpApiKey, brightDataUsername, brightDataPassword, brightDataApiKey]);

  return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Configuración de APIs</CardTitle>
        <CardDescription>
          Gestiona las configuraciones de APIs externas utilizadas en el sistema
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="openai" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="pagespeed">PageSpeed</TabsTrigger>
            <TabsTrigger value="brightdata">Bright Data</TabsTrigger>
            <TabsTrigger value="valueserp">ValueSERP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="openai">
            <OpenAITabContent 
              openAIKey={openAIKey}
              setOpenAIKey={setOpenAIKey}
              hasConfiguredOpenAIKey={!!openAIKey || !!localStorage.getItem('openai_api_key')}
            />
          </TabsContent>
          
          <TabsContent value="pagespeed">
            <PageSpeedTabContent 
              pageSpeedKey={pageSpeedKey}
              setPageSpeedKey={setPageSpeedKey}
              hasConfiguredPageSpeedKey={!!pageSpeedKey || !!localStorage.getItem('pagespeed_api_key')}
            />
          </TabsContent>
          
          <TabsContent value="brightdata">
            <BrightDataTabContent 
              brightDataUsername={brightDataUsername}
              setBrightDataUsername={setBrightDataUsername}
              brightDataPassword={brightDataPassword}
              setBrightDataPassword={setBrightDataPassword}
              brightDataApiKey={brightDataApiKey}
              setBrightDataApiKey={setBrightDataApiKey}
            />
          </TabsContent>
          
          <TabsContent value="valueserp">
            <ValueSerpSettings 
              valueSerpApiKey={valueSerpApiKey}
              setValueSerpApiKey={setValueSerpApiKey}
              hasConfiguredValueSerpKey={!!valueSerpApiKey || !!localStorage.getItem('valueserp_api_key')}
              brightDataUsername={brightDataUsername}
              setBrightDataUsername={setBrightDataUsername}
              brightDataPassword={brightDataPassword}
              setBrightDataPassword={setBrightDataPassword}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-border/40 pt-4">
        <Alert className="bg-yellow-500/10 border-yellow-500/20 px-3 py-2 text-sm">
          <Share2 className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-xs">
            Las claves API se guardan localmente en tu navegador y no se comparten con el servidor.
          </AlertDescription>
        </Alert>
      </CardFooter>
    </Card>
  );
};

export default ApiSettings;
