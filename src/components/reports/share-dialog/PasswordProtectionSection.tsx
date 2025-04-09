
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, RefreshCw } from 'lucide-react';

interface PasswordProtectionSectionProps {
  passwordProtected: boolean;
  setPasswordProtected: (value: boolean) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  onUpdatePassword: () => Promise<void>;
  generateRandomPassword: () => void;
}

const PasswordProtectionSection: React.FC<PasswordProtectionSectionProps> = ({
  passwordProtected,
  setPasswordProtected,
  password,
  setPassword,
  isLoading,
  onUpdatePassword,
  generateRandomPassword
}) => {
  return (
    <div className="border-t border-border pt-4 mt-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="password-protection"
            checked={passwordProtected}
            onCheckedChange={setPasswordProtected}
          />
          <Label htmlFor="password-protection" className="flex items-center gap-1">
            {passwordProtected ? (
              <Lock className="h-4 w-4 text-amber-500" />
            ) : (
              <Unlock className="h-4 w-4 text-muted-foreground" />
            )}
            Proteger con contraseña
          </Label>
        </div>
      </div>
      
      {passwordProtected && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce una contraseña"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={generateRandomPassword}
              title="Generar contraseña aleatoria"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            El destinatario necesitará esta contraseña para ver el informe
          </p>
        </div>
      )}
      
      <Button 
        className="mt-4 w-full"
        onClick={onUpdatePassword}
        disabled={isLoading || (passwordProtected && !password)}
      >
        {passwordProtected ? 'Actualizar protección' : 'Quitar protección'}
      </Button>
    </div>
  );
};

export default PasswordProtectionSection;
