
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface PasswordProtectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  password: string;
  setPassword: (password: string) => void;
  onVerify: () => void;
  isVerifying: boolean;
  showError: boolean;
  errorMessage: string;
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
  errorMessage
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
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
              placeholder="Introduce la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="off"
            />
            {showError && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isVerifying || !password.trim()}
          >
            {isVerifying ? "Verificando..." : "Acceder"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordProtectionDialog;
