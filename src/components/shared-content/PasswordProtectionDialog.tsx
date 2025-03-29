
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface PasswordProtectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (password: string) => Promise<string | void>;
  onCancel: () => void;
  type: 'report' | 'proposal' | 'invoice' | 'contract';
}

const types = {
  report: 'informe',
  proposal: 'propuesta',
  invoice: 'factura',
  contract: 'contrato'
};

const PasswordProtectionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  type
}: PasswordProtectionDialogProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const typeText = types[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Contraseña requerida');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onSubmit(password);
      if (result) {
        setError(result);
      }
    } catch (err: any) {
      setError(err.message || 'Error al verificar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) onCancel();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <span>Contenido protegido</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <p>Este {typeText} está protegido por contraseña. Por favor, introduce la contraseña para acceder.</p>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "border-red-500" : ""}
              autoFocus
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verificando...' : 'Acceder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordProtectionDialog;
