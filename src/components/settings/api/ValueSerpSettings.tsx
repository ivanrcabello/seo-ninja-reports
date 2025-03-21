
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
  const [isSaving, setIsSaving] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [inputKey, setInputKey] = useState(valueSerpApiKey);
  
  // Initialize from localStorage and database on mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        // First check localStorage
        const localKey = localStorage.getItem('value_serp_api_key');
        if (localKey && localKey.length > 0) {
          console.log('Found ValueSerp API key in localStorage (length): ' + localKey.length);
          setInputKey(localKey);
          setValueSerpApiKey(localKey);
          return;
        }
        
        // If not in localStorage, check database
        const { data, error } = await supabase
          .from('settings')
          .select('value_serp_key')
          .eq('id', 1)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching ValueSerp API key:', error);
        } else if (data?.value_serp_key) {
          console.log('Loaded ValueSerp API key from database (length): ' + data.value_serp_key.length);
          setInputKey(data.value_serp_key);
          setValueSerpApiKey(data.value_serp_key);
          // Also update localStorage
          localStorage.setItem('value_serp_api_key', data.value_serp_key);
        }
      } catch (err) {
        console.error('Exception fetching ValueSerp API key:', err);
      }
    };
    
    fetchApiKey();
  }, [setValueSerpApiKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputKey(e.target.value);
  };
  
  // Save the API key to both localStorage and database
  const handleSave = async () => {
    if (!inputKey || inputKey.length < 5) {
      toast.error('La clave API no es válida');
      return;
    }
    
    setIsSaving(true);
    setUpdateStatus('saving');
    
    try {
      // Save immediately to localStorage
      localStorage.setItem('value_serp_api_key', inputKey);
      console.log('ValueSerp API key stored in localStorage (length): ' + inputKey.length);
      
      // Update component state
      setValueSerpApiKey(inputKey);
      
      // Save to Supabase
      const { error } = await supabase
        .from('settings')
        .update({ 
          value_serp_key: inputKey,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
        
      if (error) {
        console.error('Error saving ValueSerp API key to settings:', error);
        toast.error('Error al guardar la API key en la base de datos');
        setUpdateStatus('error');
      } else {
        console.log('ValueSerp API key saved successfully to settings table');
        toast.success('API key de ValueSerp guardada correctamente');
        setUpdateStatus('success');
      }
    } catch (err) {
      console.error('Exception saving ValueSerp API key:', err);
      toast.error('Error al guardar la API key');
      setUpdateStatus('error');
    } finally {
      setIsSaving(false);
      
      // Reset status after a delay
      setTimeout(() => {
        setUpdateStatus('idle');
      }, 3000);
    }
  };

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
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1">
              <KeyRound className="h-5 w-5 text-muted-foreground" />
              <Input
                id="valueSerpApiKey"
                type="password"
                value={inputKey}
                onChange={handleInputChange}
                placeholder="Introduce tu clave API de ValueSerp"
                className={`flex-1 ${updateStatus === 'saving' ? 'bg-amber-50' : 
                              updateStatus === 'success' ? 'bg-green-50' : 
                              updateStatus === 'error' ? 'bg-red-50' : ''}`}
              />
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || inputKey === valueSerpApiKey}
            >
              Guardar
            </Button>
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
        
        {updateStatus === 'saving' && (
          <p className="text-xs text-primary">Guardando API key...</p>
        )}
        {updateStatus === 'success' && (
          <p className="text-xs text-green-600">API key guardada correctamente</p>
        )}
        {updateStatus === 'error' && (
          <p className="text-xs text-red-600">Error al guardar la API key</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ValueSerpSettings;
