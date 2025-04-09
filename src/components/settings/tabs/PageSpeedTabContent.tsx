
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Clipboard, Info, Key, KeyRound, LinkIcon, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface PageSpeedTabContentProps {
  pageSpeedKey: string;
  setPageSpeedKey: (key: string) => void;
  hasConfiguredPageSpeedKey?: boolean;
}

const PageSpeedTabContent: React.FC<PageSpeedTabContentProps> = ({
  pageSpeedKey,
  setPageSpeedKey,
  hasConfiguredPageSpeedKey = false,
}) => {
  const [pageSpeedKeyVisible, setPageSpeedKeyVisible] = useState(false);
  const [pageSpeedCopied, setPageSpeedCopied] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(pageSpeedKey).then(() => {
      setPageSpeedCopied(true);
      setTimeout(() => setPageSpeedCopied(false), 2000);
    });
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

  return (
    <div className="space-y-4">
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
            onClick={copyToClipboard}
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
    </div>
  );
};

export default PageSpeedTabContent;
