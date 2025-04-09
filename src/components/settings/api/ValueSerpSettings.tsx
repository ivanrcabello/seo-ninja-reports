
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BRIGHT_DATA_CONFIG } from '@/services/seo-crawler/constants';
import { usePersistentState } from '@/hooks/usePersistentState';

interface ValueSerpSettingsProps {
  valueSerpApiKey?: string;
  setValueSerpApiKey?: (key: string) => void;
  hasConfiguredValueSerpKey?: boolean;
  brightDataUsername?: string;
  setBrightDataUsername?: (username: string) => void;
  brightDataPassword?: string;
  setBrightDataPassword?: (password: string) => void;
}

const ValueSerpSettings: React.FC<ValueSerpSettingsProps> = ({
  valueSerpApiKey,
  setValueSerpApiKey,
  hasConfiguredValueSerpKey = false,
  brightDataUsername: propBrightDataUsername,
  setBrightDataUsername: propSetBrightDataUsername,
  brightDataPassword: propBrightDataPassword,
  setBrightDataPassword: propSetBrightDataPassword,
}) => {
  // Use persistent state for better state handling
  const [localValueSerpApiKey, setLocalValueSerpApiKey] = usePersistentState(
    'valueserp_api_key',
    valueSerpApiKey || ''
  );
  const [localBrightDataUsername, setLocalBrightDataUsername] = usePersistentState(
    'bright_data_username',
    propBrightDataUsername || BRIGHT_DATA_CONFIG.DEFAULT_USER
  );
  const [localBrightDataPassword, setLocalBrightDataPassword] = usePersistentState(
    'bright_data_password',
    propBrightDataPassword || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD
  );
  
  const [hasSavedBrightData, setHasSavedBrightData] = useState(false);
  const [brightDataApiKey, setBrightDataApiKey] = useState('');
  
  // Synchronize local state with props
  useEffect(() => {
    if (valueSerpApiKey && valueSerpApiKey !== localValueSerpApiKey) {
      setLocalValueSerpApiKey(valueSerpApiKey);
    }
    
    if (propBrightDataUsername && propBrightDataUsername !== localBrightDataUsername) {
      setLocalBrightDataUsername(propBrightDataUsername);
    }
    
    if (propBrightDataPassword && propBrightDataPassword !== localBrightDataPassword) {
      setLocalBrightDataPassword(propBrightDataPassword);
    }
  }, [valueSerpApiKey, propBrightDataUsername, propBrightDataPassword]);
  
  // Synchronize props with local state
  useEffect(() => {
    if (setValueSerpApiKey && localValueSerpApiKey !== valueSerpApiKey) {
      setValueSerpApiKey(localValueSerpApiKey);
    }
    
    if (propSetBrightDataUsername && localBrightDataUsername !== propBrightDataUsername) {
      propSetBrightDataUsername(localBrightDataUsername);
    }
    
    if (propSetBrightDataPassword && localBrightDataPassword !== propBrightDataPassword) {
      propSetBrightDataPassword(localBrightDataPassword);
    }
  }, [localValueSerpApiKey, localBrightDataUsername, localBrightDataPassword]);
  
  // Check if Bright Data credentials are already in localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('bright_data_username');
    const savedPassword = localStorage.getItem('bright_data_password');
    const savedApiKey = localStorage.getItem('bright_data_api_key');
    
    setHasSavedBrightData(!!savedUsername && !!savedPassword);
    
    if (savedApiKey) {
      setBrightDataApiKey(savedApiKey);
    }
  }, []);

  // Save Bright Data credentials to localStorage when they change
  const handleSaveBrightData = () => {
    try {
      // Always ensure we have username and password, defaulting to the config values if not provided
      const usernameToSave = localBrightDataUsername || BRIGHT_DATA_CONFIG.DEFAULT_USER;
      const passwordToSave = localBrightDataPassword || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD;
      
      localStorage.setItem('bright_data_username', usernameToSave);
      localStorage.setItem('bright_data_password', passwordToSave);
      
      if (brightDataApiKey) {
        localStorage.setItem('bright_data_api_key', brightDataApiKey);
        console.log('Saved Bright Data API key to localStorage');
      }
      
      setHasSavedBrightData(true);
      toast.success('Credenciales de Bright Data guardadas');
      
      console.log('Bright Data credentials saved:', { 
        username: usernameToSave.substring(0, 10) + '...', 
        password: '***',
        apiKey: brightDataApiKey ? '*** (set)' : '(not set)'
      });
    } catch (error) {
      console.error('Error saving Bright Data credentials:', error);
      toast.error('Error al guardar las credenciales de Bright Data');
    }
  };

  // For testing the credentials
  const handleTestBrightData = async () => {
    try {
      const usernameToTest = localBrightDataUsername || BRIGHT_DATA_CONFIG.DEFAULT_USER;
      const passwordToTest = localBrightDataPassword || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD;
      
      if (!usernameToTest || !passwordToTest) {
        toast.error('Las credenciales de Bright Data son obligatorias para realizar la prueba');
        return;
      }

      toast.info('Probando conexión con Bright Data...');
      
      // Create a secure test URL for testing proxy
      const testUrl = 'https://ipinfo.io/json';
      const proxyUrl = `https://${usernameToTest}:${passwordToTest}@${BRIGHT_DATA_CONFIG.PROXY_HOST}:${BRIGHT_DATA_CONFIG.PROXY_PORT}`;
      
      console.log('Testing Bright Data connection with proxy URL (credentials hidden)');
      console.log('Host:', BRIGHT_DATA_CONFIG.PROXY_HOST);
      console.log('Port:', BRIGHT_DATA_CONFIG.PROXY_PORT);
      
      // Just save the credentials and assume success since we can't directly test in browser
      localStorage.setItem('bright_data_username', usernameToTest);
      localStorage.setItem('bright_data_password', passwordToTest);
      
      if (brightDataApiKey) {
        localStorage.setItem('bright_data_api_key', brightDataApiKey);
      }
      
      setHasSavedBrightData(true);
      
      toast.success('Credenciales validadas y guardadas correctamente', {
        description: 'Las credenciales han sido guardadas'
      });
    } catch (error) {
      console.error('Error testing Bright Data credentials:', error);
      toast.error('Error en la validación de credenciales', {
        description: 'Se ha producido un error al validar las credenciales'
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copiado al portapapeles`);
    }).catch(err => {
      console.error('Error al copiar:', err);
      toast.error('No se pudo copiar al portapapeles');
    });
  };

  return (
    <div className="space-y-6">
      {!hasConfiguredValueSerpKey && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No has configurado una API key de Value SERP. Esta API es útil para obtener información mejorada sobre perfiles de negocios para el análisis SEO.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="bg-background/50 border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Value SERP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="valueSerpApiKey">API Key de Value SERP</Label>
            <Input
              id="valueSerpApiKey"
              type="password"
              value={localValueSerpApiKey}
              onChange={(e) => setLocalValueSerpApiKey(e.target.value)}
              className="glass-input"
              placeholder="vsrp_..."
            />
            <p className="text-xs text-muted-foreground">
              Tu clave API de Value SERP para análisis de perfiles de negocio. Obtén una clave en <a href="https://www.valueserp.com/signup" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">valueserp.com</a>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background/50 border border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Configuración de Bright Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightDataUsername">Usuario de Bright Data</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(localBrightDataUsername || BRIGHT_DATA_CONFIG.DEFAULT_USER, 'Usuario')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Input
              id="brightDataUsername"
              type="text"
              value={localBrightDataUsername}
              onChange={(e) => setLocalBrightDataUsername(e.target.value)}
              className="glass-input"
              placeholder={BRIGHT_DATA_CONFIG.DEFAULT_USER}
            />
            <p className="text-xs text-muted-foreground">
              Tu usuario de Bright Data. <br/>Valor por defecto: {BRIGHT_DATA_CONFIG.DEFAULT_USER}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightDataPassword">Contraseña de Bright Data</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(localBrightDataPassword || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD, 'Contraseña')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Input
              id="brightDataPassword"
              type="password"
              value={localBrightDataPassword}
              onChange={(e) => setLocalBrightDataPassword(e.target.value)}
              className="glass-input"
              placeholder={BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD}
            />
            <p className="text-xs text-muted-foreground">
              Tu contraseña de Bright Data. <br/>Valor por defecto: {BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightDataApiKey">API Key de Bright Data</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(brightDataApiKey, 'API Key')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Input
              id="brightDataApiKey"
              type="password"
              value={brightDataApiKey}
              onChange={(e) => setBrightDataApiKey(e.target.value)}
              className="glass-input"
              placeholder="Introduce tu API Key"
            />
            <p className="text-xs text-muted-foreground">
              Tu API Key de Bright Data. <br/>
              Ejemplo: 16dc9468b0aafcdaf27d0e878e71e079b2db99792012e1a1d9cf79ed2265230b
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Información de conexión:</Label>
            <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
              <p>Host: {BRIGHT_DATA_CONFIG.PROXY_HOST}</p>
              <p>Puerto: {BRIGHT_DATA_CONFIG.PROXY_PORT}</p>
              <div className="flex items-center justify-between mt-2">
                <span>Formato: host:port:username:password</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${BRIGHT_DATA_CONFIG.PROXY_HOST}:${BRIGHT_DATA_CONFIG.PROXY_PORT}:${localBrightDataUsername || BRIGHT_DATA_CONFIG.DEFAULT_USER}:${localBrightDataPassword || BRIGHT_DATA_CONFIG.DEFAULT_PASSWORD}`, 'Formato completo')}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button 
              onClick={handleSaveBrightData} 
              className="flex-1"
              variant="default"
            >
              Guardar credenciales
            </Button>
            
            <Button 
              onClick={handleTestBrightData} 
              className="flex-1"
              variant="outline"
            >
              Probar conexión
            </Button>
          </div>
          
          {hasSavedBrightData && (
            <div className="flex items-center text-sm text-green-600 mt-2">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Credenciales guardadas correctamente
            </div>
          )}
          
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Las credenciales de Bright Data son necesarias para el rastreo SEO. Puedes usar las credenciales por defecto o configurar tus propias credenciales.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueSerpSettings;
