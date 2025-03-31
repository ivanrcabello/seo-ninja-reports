
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';

interface PasswordProtectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  password: string;
  setPassword: (value: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
  showError: boolean;
  errorMessage?: string;
}

const PasswordProtectionDialog: React.FC<PasswordProtectionDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  password,
  setPassword,
  onVerify,
  isVerifying,
  showError,
  errorMessage = 'La contraseña es incorrecta. Por favor, inténtalo de nuevo.'
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              className={showError ? "border-destructive focus-visible:ring-destructive" : ""}
              autoComplete="off"
            />
            {showError && (
              <p className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isVerifying || !password.trim()}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Acceder'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordProtectionDialog;
