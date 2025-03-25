
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ValueSerpSettingsProps {
  valueSerpApiKey: string;
  setValueSerpApiKey: (key: string) => void;
  hasConfiguredValueSerpKey: boolean;
  brightDataUsername: string;
  setBrightDataUsername: (username: string) => void;
  brightDataPassword: string;
  setBrightDataPassword: (password: string) => void;
}

const ValueSerpSettings: React.FC<ValueSerpSettingsProps> = ({
  valueSerpApiKey,
  setValueSerpApiKey,
  hasConfiguredValueSerpKey,
  brightDataUsername,
  setBrightDataUsername,
  brightDataPassword,
  setBrightDataPassword,
}) => {
  const [hasSavedBrightData, setHasSavedBrightData] = useState(false);
  
  // Check if Bright Data credentials are already in localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('bright_data_username');
    const savedPassword = localStorage.getItem('bright_data_password');
    
    if (savedUsername && savedPassword) {
      setBrightDataUsername(savedUsername);
      setBrightDataPassword(savedPassword);
      setHasSavedBrightData(true);
    }
  }, [setBrightDataUsername, setBrightDataPassword]);

  // Save Bright Data credentials to localStorage when they change
  const handleSaveBrightData = () => {
    if (brightDataPassword) {
      localStorage.setItem('bright_data_username', brightDataUsername);
      localStorage.setItem('bright_data_password', brightDataPassword);
      setHasSavedBrightData(true);
      toast.success('Credenciales de Bright Data guardadas');
    } else {
      toast.error('La API key de Bright Data es obligatoria');
    }
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
              value={valueSerpApiKey}
              onChange={(e) => setValueSerpApiKey(e.target.value)}
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
            <Label htmlFor="brightDataUsername">Zone de Bright Data (opcional)</Label>
            <Input
              id="brightDataUsername"
              type="text"
              value={brightDataUsername}
              onChange={(e) => setBrightDataUsername(e.target.value)}
              className="glass-input"
              placeholder="web_unlocker1"
            />
            <p className="text-xs text-muted-foreground">
              La zona de Bright Data a utilizar. Por defecto: web_unlocker1
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brightDataPassword">API Key de Bright Data</Label>
            <Input
              id="brightDataPassword"
              type="password"
              value={brightDataPassword}
              onChange={(e) => setBrightDataPassword(e.target.value)}
              className="glass-input"
              placeholder="Clave API de Bright Data"
            />
            <p className="text-xs text-muted-foreground">
              Tu clave API de Bright Data (token) para el acceso. Puedes obtenerla en tu panel de Bright Data.
            </p>
          </div>
          
          <Button 
            onClick={handleSaveBrightData} 
            className="w-full mt-2"
            variant="default"
          >
            Guardar credenciales de Bright Data
          </Button>
          
          {hasSavedBrightData && (
            <div className="flex items-center text-sm text-green-600 mt-2">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Credenciales guardadas correctamente
            </div>
          )}
          
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Las credenciales de Bright Data son necesarias para el rastreo SEO. Asegúrate de configurarlas antes de utilizar el rastreador.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueSerpSettings;
