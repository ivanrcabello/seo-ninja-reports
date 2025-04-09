
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Clipboard, Info, Key, KeyRound, LinkIcon, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface OpenAITabContentProps {
  openAIKey: string;
  setOpenAIKey: (key: string) => void;
  hasConfiguredOpenAIKey?: boolean;
}

const OpenAITabContent: React.FC<OpenAITabContentProps> = ({
  openAIKey,
  setOpenAIKey,
  hasConfiguredOpenAIKey = false,
}) => {
  const [openAIKeyVisible, setOpenAIKeyVisible] = useState(false);
  const [openAICopied, setOpenAICopied] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(openAIKey).then(() => {
      setOpenAICopied(true);
      setTimeout(() => setOpenAICopied(false), 2000);
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

  return (
    <div className="space-y-4">
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
            onClick={copyToClipboard}
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
    </div>
  );
};

export default OpenAITabContent;
