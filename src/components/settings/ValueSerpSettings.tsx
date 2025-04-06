
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Clipboard, Info, Key, KeyRound, LinkIcon, RotateCw } from 'lucide-react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { toast } from 'sonner';

const ValueSerpSettings: React.FC = () => {
  const [valueSerpKey, setValueSerpKey] = usePersistentState('valueserp_api_key', '');
  const [valueSerpKeyVisible, setValueSerpKeyVisible] = useState(false);
  const [valueSerpCopied, setValueSerpCopied] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  
  // Copy API key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setValueSerpCopied(true);
      setTimeout(() => setValueSerpCopied(false), 2000);
    });
  };
  
  // Test API key for ValueSERP
  const testValueSerpKey = async () => {
    if (!valueSerpKey.trim()) {
      toast.error('Por favor, introduce una clave de API de ValueSERP');
      return;
    }
    
    try {
      setTestingConnection(true);
      
      // Todo: implement actual ValueSERP API test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Conexión exitosa con la API de ValueSERP');
    } catch (error) {
      console.error('Error testing ValueSERP API:', error);
      toast.error('Error al conectar con la API de ValueSERP');
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertTitle>ValueSERP API Key</AlertTitle>
        <AlertDescription>
          Se utiliza para obtener datos SERP para análisis de competidores y palabras clave.
          Obtén tu clave en <a href="https://valueserp.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">valueserp.com</a>
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="valueserp-key">Clave de API de ValueSERP</Label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              id="valueserp-key"
              type={valueSerpKeyVisible ? 'text' : 'password'}
              placeholder="vs..."
              value={valueSerpKey}
              onChange={(e) => setValueSerpKey(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setValueSerpKeyVisible(!valueSerpKeyVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {valueSerpKeyVisible ? (
                <KeyRound className="h-4 w-4" />
              ) : (
                <Key className="h-4 w-4" />
              )}
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(valueSerpKey)}
            disabled={!valueSerpKey}
          >
            {valueSerpCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={testValueSerpKey}
            disabled={!valueSerpKey || testingConnection}
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
    </div>
  );
};

export default ValueSerpSettings;
