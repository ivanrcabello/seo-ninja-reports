
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

export interface PasswordProtectionDialogProps {
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSubmit: (password: string) => Promise<void>;
  onCancel: () => void;
  type: 'report' | 'proposal' | 'invoice' | 'contract';
  error?: string;
}

const PasswordProtectionDialog: React.FC<PasswordProtectionDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  type,
  error
}) => {
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(password);
  };

  const typeMap = {
    report: 'informe',
    proposal: 'propuesta',
    invoice: 'factura',
    contract: 'contrato'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contenido protegido con contraseña</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Este {typeMap[type]} está protegido. Para verlo, introduce la contraseña proporcionada.
            </p>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full"
              autoFocus
            />
            {error && (
              <div className="flex items-center text-xs text-destructive mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">Acceder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordProtectionDialog;
