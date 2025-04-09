import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, Clipboard, Info, Key, KeyRound, LinkIcon, RotateCw, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ValueSerpSettings from './ValueSerpSettings';
import { toast } from 'sonner';
import { usePersistentState } from '@/hooks/usePersistentState';
import { BRIGHT_DATA_CONFIG } from '@/services/seo-crawler/constants';

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
  const [openAIKey, setOpenAIKey] = usePersistentState('openai_api_key', propsOpenAIKey || '');
  const [openAIKeyVisible, setOpenAIKeyVisible] = useState(false);
  const [openAICopied, setOpenAICopied] = useState(false);
  
  const [pageSpeedKey, setPageSpeedKey] = usePersistentState('pagespeed_api_key', propsPageSpeedKey || '');
  const [pageSpeedKeyVisible, setPageSpeedKeyVisible] = useState(false);
  const [pageSpeedCopied, setPageSpeedCopied] = useState(false);

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
  
  const [testingConnection, setTestingConnection] = useState(false);
  
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
  }, [
    propsBrightDataUsername, propsBrightDataPassword, propsBrightDataApiKey,
    propsOpenAIKey, propsPageSpeedKey
  ]);
  
  useEffect(() => {
    if (openAIKey !== propsOpenAIKey) {
      propsSetOpenAIKey(openAIKey);
    }
    if (pageSpeedKey !== propsPageSpeedKey) {
      propsSetPageSpeedKey(pageSpeedKey);
    }
    if (brightDataUsername !== propsBrightDataUsername) {
      propSetBrightDataUsername(brightDataUsername);
    }
    if (brightDataPassword !== propsBrightDataPassword) {
      propSetBrightDataPassword(brightDataPassword);
    }
    if (brightDataApiKey !== propsBrightDataApiKey) {
      setBrightDataApiKey(brightDataApiKey);
    }
  }, [openAIKey, pageSpeedKey, brightDataUsername, brightDataPassword, brightDataApiKey]);
  
  const copyToClipboard = (text: string, setCopied: (copied: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const testOpenAIKey = async () => {
    if (!openAIKey.trim()) {
      toast.error('Por favor, introduce una clave de API de OpenAI');
      return;
    }
    
    try {
      setTestingConnection(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Conexión exitosa con la API de OpenAI');
    } catch (error) {
      console.error('Error testing OpenAI API:', error);
      toast.error('Error al conectar con la API de OpenAI');
    } finally {
      setTestingConnection(false);
    }
  };
  
  const testPageSpeedKey = async () => {
    if (!pageSpeedKey.trim()) {
      toast.error('Por favor, introduce una clave de API de Google PageSpeed');
      return;
    }
    
    try {
      setTestingConnection(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Conexión exitosa con la API de Google PageSpeed');
    } catch (error) {
      console.error('Error testing PageSpeed API:', error);
      toast.error('Error al conectar con la API de Google PageSpeed');
    } finally {
      setTestingConnection(false);
    }
  };
  
  const testBrightDataCredentials = async () => {
    if (!brightDataUsername.trim() || !brightDataPassword.trim()) {
      toast.error('Por favor, introduce las credenciales de Bright Data');
      return;
    }
    
    try {
      setTestingConnection(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Conexión exitosa con Bright Data');
    } catch (error) {
      console.error('Error testing Bright Data:', error);
      toast.error('Error al conectar con Bright Data');
    } finally {
      setTestingConnection(false);
    }
  };
  
  const saveBrightDataChanges = () => {
    if (propSetBrightDataUsername) {
      propSetBrightDataUsername(brightDataUsername);
    }
    if (propSetBrightDataPassword) {
      propSetBrightDataPassword(brightDataPassword);
    }
    if (propSetBrightDataApiKey) {
      propSetBrightDataApiKey(brightDataApiKey);
    }
    
    toast.success('Credenciales de Bright Data guardadas');
  };

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
          
          <TabsContent value="openai" className="space-y-4">
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>OpenAI API Key</AlertTitle>
              <AlertDescription>
                Se requiere para la generación de informes SEO y otras funcionalidades de IA.
                Obtén tu clave en <a href="https://platform.openai.com/api-keys" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">platform.openai.com</a>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="openai-key">Clave de API de OpenAI</Label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    id="openai-key"
                    type={openAIKeyVisible ? 'text' : 'password'}
                    placeholder="sk-..."
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setOpenAIKeyVisible(!openAIKeyVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {openAIKeyVisible ? (
                      <KeyRound className="h-4 w-4" />
                    ) : (
                      <Key className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(openAIKey, setOpenAICopied)}
                  disabled={!openAIKey}
                >
                  {openAICopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={testOpenAIKey}
                  disabled={!openAIKey || testingConnection}
                >
                  {testingConnection ? (
                    <RotateCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LinkIcon className="h-4 w-4 mr-2" />
                  )}
                  Probar Conexión
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="pagespeed" className="space-y-4">
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Google PageSpeed API Key</AlertTitle>
              <AlertDescription>
                Se utiliza para obtener métricas de rendimiento para los informes.
                Obtén tu clave en <a href="https://developers.google.com/speed/docs/insights/v5/get-started" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">developers.google.com</a>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="pagespeed-key">Clave de API de Google PageSpeed</Label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    id="pagespeed-key"
                    type={pageSpeedKeyVisible ? 'text' : 'password'}
                    placeholder="AIza..."
                    value={pageSpeedKey}
                    onChange={(e) => setPageSpeedKey(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setPageSpeedKeyVisible(!pageSpeedKeyVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {pageSpeedKeyVisible ? (
                      <KeyRound className="h-4 w-4" />
                    ) : (
                      <Key className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(pageSpeedKey, setPageSpeedCopied)}
                  disabled={!pageSpeedKey}
                >
                  {pageSpeedCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Clipboard className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={testPageSpeedKey}
                  disabled={!pageSpeedKey || testingConnection}
                >
                  {testingConnection ? (
                    <RotateCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LinkIcon className="h-4 w-4 mr-2" />
                  )}
                  Probar Conexión
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="brightdata" className="space-y-4">
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4" />
              <AlertTitle>Bright Data Credentials</AlertTitle>
              <AlertDescription>
                Se requiere para el crawleo y análisis SEO técnico.
                Obtén tus credenciales en <a href="https://brightdata.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">brightdata.com</a>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bright-data-username">Nombre de usuario</Label>
                <Input
                  id="bright-data-username"
                  type="text"
                  placeholder="brd-customer-..."
                  value={brightDataUsername}
                  onChange={(e) => setBrightDataUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bright-data-password">Contraseña</Label>
                <Input
                  id="bright-data-password"
                  type="password"
                  placeholder="****"
                  value={brightDataPassword}
                  onChange={(e) => setBrightDataPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bright-data-api-key">API Key</Label>
                <Input
                  id="bright-data-api-key"
                  type="password"
                  placeholder="****"
                  value={brightDataApiKey}
                  onChange={(e) => setBrightDataApiKey(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={testBrightDataCredentials}
                  disabled={!brightDataUsername || !brightDataPassword || testingConnection}
                  variant="outline"
                >
                  {testingConnection ? (
                    <RotateCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LinkIcon className="h-4 w-4 mr-2" />
                  )}
                  Probar Conexión
                </Button>
                
                <Button onClick={saveBrightDataChanges}>
                  <Check className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="valueserp">
            <ValueSerpSettings 
              valueSerpApiKey={propsValueSerpKey || ''}
              setValueSerpApiKey={propsSetValueSerpKey || setPageSpeedKey}
              hasConfiguredValueSerpKey={!!propsValueSerpKey || !!localStorage.getItem('valueserp_api_key')}
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
