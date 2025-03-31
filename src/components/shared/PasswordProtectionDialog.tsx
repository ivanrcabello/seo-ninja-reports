
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';

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
  errorMessage: string;
}

export const PasswordProtectionDialog: React.FC<PasswordProtectionDialogProps> = ({
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Introduce la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {showError && (
                <div className="text-sm flex items-center text-destructive mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errorMessage}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isVerifying || !password}>
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordProtectionDialog;
