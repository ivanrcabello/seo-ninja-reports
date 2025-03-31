
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onVerify();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center pt-2">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Introduce la contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`${showError ? 'border-red-500' : ''}`}
            />
            {showError && <p className="text-sm text-red-500">{errorMessage}</p>}
          </div>
          <Button 
            onClick={onVerify} 
            disabled={isVerifying || !password.trim()} 
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando
              </>
            ) : (
              'Acceder'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordProtectionDialog;
