
import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Clipboard, Info, Key, KeyRound, LinkIcon, RotateCw } from 'lucide-react';
import { usePersistentState } from '@/hooks/usePersistentState';
import { toast } from 'sonner';

const BrightDataSettings: React.FC = () => {
  const [brightDataUsername, setBrightDataUsername] = usePersistentState('bright_data_username', 'brd-customer-hl_2a8d2c33-zone-web_unlocker');
  const [brightDataPassword, setBrightDataPassword] = usePersistentState('bright_data_password', 'obz0lal9qh4g');
  const [brightDataApiKey, setBrightDataApiKey] = usePersistentState('bright_data_api_key', '');
  
  const [usernameVisible, setUsernameVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [isCopied, setIsCopied] = useState<{[key: string]: boolean}>({});
  
  // Copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied({...isCopied, [field]: true});
      setTimeout(() => setIsCopied({...isCopied, [field]: false}), 2000);
    });
  };
  
  const handleSave = () => {
    try {
      localStorage.setItem('bright_data_username', brightDataUsername);
      localStorage.setItem('bright_data_password', brightDataPassword);
      localStorage.setItem('bright_data_api_key', brightDataApiKey);
      
      toast.success('Bright Data credentials saved');
    } catch (error) {
      console.error('Error saving Bright Data credentials:', error);
      toast.error('Error saving credentials');
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4" />
        <AlertTitle>Bright Data Credentials</AlertTitle>
        <AlertDescription>
          Se utiliza para obtener contenido de sitios web para el crawler SEO.
          Configura tus credenciales de Bright Data para mejorar la capacidad de crawler.
          Sin API key se usará una cuenta compartida con limitaciones.
        </AlertDescription>
      </Alert>
      
      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="bd-username">Bright Data Username</Label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              id="bd-username"
              type={usernameVisible ? 'text' : 'password'}
              value={brightDataUsername}
              onChange={(e) => setBrightDataUsername(e.target.value)}
              className="pr-10"
              placeholder="brd-customer-xxx..."
            />
            <button
              type="button"
              onClick={() => setUsernameVisible(!usernameVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {usernameVisible ? (
                <KeyRound className="h-4 w-4" />
              ) : (
                <Key className="h-4 w-4" />
              )}
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(brightDataUsername, 'username')}
            disabled={!brightDataUsername}
          >
            {isCopied.username ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="bd-password">Bright Data Password</Label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              id="bd-password"
              type={passwordVisible ? 'text' : 'password'}
              value={brightDataPassword}
              onChange={(e) => setBrightDataPassword(e.target.value)}
              className="pr-10"
              placeholder="password123..."
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {passwordVisible ? (
                <KeyRound className="h-4 w-4" />
              ) : (
                <Key className="h-4 w-4" />
              )}
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(brightDataPassword, 'password')}
            disabled={!brightDataPassword}
          >
            {isCopied.password ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* API Key */}
      <div className="space-y-2">
        <Label htmlFor="bd-apikey">Bright Data API Key</Label>
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              id="bd-apikey"
              type={apiKeyVisible ? 'text' : 'password'}
              value={brightDataApiKey}
              onChange={(e) => setBrightDataApiKey(e.target.value)}
              className="pr-10"
              placeholder="1a2b3c4d..."
            />
            <button
              type="button"
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {apiKeyVisible ? (
                <KeyRound className="h-4 w-4" />
              ) : (
                <Key className="h-4 w-4" />
              )}
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(brightDataApiKey, 'apikey')}
            disabled={!brightDataApiKey}
          >
            {isCopied.apikey ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <Button onClick={handleSave} className="mt-4">
        Guardar Credenciales
      </Button>
    </div>
  );
};

export default BrightDataSettings;
