
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface ValueSerpSettingsProps {
  valueSerpApiKey: string;
  setValueSerpApiKey: (key: string) => void;
  hasConfiguredValueSerpKey: boolean;
}

const ValueSerpSettings: React.FC<ValueSerpSettingsProps> = ({
  valueSerpApiKey,
  setValueSerpApiKey,
  hasConfiguredValueSerpKey
}) => {
  const handleValueSerpKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueSerpApiKey(e.target.value);
  };

  // Set API key to local storage and update settings table
  useEffect(() => {
    if (valueSerpApiKey) {
      // Guardar en localStorage para uso inmediato
      localStorage.setItem('value_serp_api_key', valueSerpApiKey);
      console.log('ValueSerp API key stored in localStorage');
      
      // También actualizar en Supabase para persistencia
      const updateApiKeyInSettings = async () => {
        try {
          const { error } = await supabase
            .from('settings')
            .update({ value_serp_key: valueSerpApiKey })
            .eq('id', 1);
            
          if (error) {
            console.error('Error saving ValueSerp API key to settings:', error);
          }
        } catch (err) {
          console.error('Exception saving ValueSerp API key:', err);
        }
      };
      
      updateApiKeyInSettings();
    }
  }, [valueSerpApiKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          ValueSerp API
        </CardTitle>
        <CardDescription>
          Configura la API de ValueSerp para extraer datos completos de perfiles de negocios en Google
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="valueSerpApiKey">
            ValueSerp API Key {hasConfiguredValueSerpKey && (
              <CheckCircle className="h-4 w-4 inline-block ml-2 text-green-500" />
            )}
          </Label>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-muted-foreground" />
            <Input
              id="valueSerpApiKey"
              type="password"
              value={valueSerpApiKey}
              onChange={handleValueSerpKeyChange}
              placeholder="Introduce tu clave API de ValueSerp"
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Esta API se utiliza para extraer información detallada de perfiles de negocios en Google
          </p>
        </div>
        
        {!hasConfiguredValueSerpKey && (
          <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              La extracción de datos de perfiles de negocios funcionará mejor con una API Key de ValueSerp. 
              Puedes obtener una en <a href="https://www.valueserp.com/" target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline">ValueSerp.com</a>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ValueSerpSettings;
