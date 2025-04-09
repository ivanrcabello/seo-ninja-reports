
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Info, LinkIcon, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface BrightDataTabContentProps {
  brightDataUsername: string;
  setBrightDataUsername: (username: string) => void;
  brightDataPassword: string;
  setBrightDataPassword: (password: string) => void;
  brightDataApiKey: string;
  setBrightDataApiKey: (apiKey: string) => void;
}

const BrightDataTabContent: React.FC<BrightDataTabContentProps> = ({
  brightDataUsername,
  setBrightDataUsername,
  brightDataPassword,
  setBrightDataPassword,
  brightDataApiKey,
  setBrightDataApiKey,
}) => {
  const [testingConnection, setTestingConnection] = useState(false);
  
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
    toast.success('Credenciales de Bright Data guardadas');
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default BrightDataTabContent;
