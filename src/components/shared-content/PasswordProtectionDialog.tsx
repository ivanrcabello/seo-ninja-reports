
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export interface PasswordProtectionDialogProps {
  onSubmit: (password: string) => Promise<void> | void;
  onCancel: () => void;
  type: 'report' | 'proposal' | 'invoice' | 'contract';
  error?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getTitle = (type: string) => {
  switch (type) {
    case 'report':
      return 'Informe Protegido';
    case 'proposal':
      return 'Propuesta Protegida';
    case 'invoice':
      return 'Factura Protegida';
    case 'contract':
      return 'Contrato Protegido';
    default:
      return 'Contenido Protegido';
  }
};

const getDescription = (type: string) => {
  switch (type) {
    case 'report':
      return 'Este informe está protegido con contraseña. Por favor, introduce la contraseña para verlo.';
    case 'proposal':
      return 'Esta propuesta está protegida con contraseña. Por favor, introduce la contraseña para verla.';
    case 'invoice':
      return 'Esta factura está protegida con contraseña. Por favor, introduce la contraseña para verla.';
    case 'contract':
      return 'Este contrato está protegido con contraseña. Por favor, introduce la contraseña para verlo.';
    default:
      return 'Este contenido está protegido con contraseña. Por favor, introduce la contraseña para verlo.';
  }
};

const PasswordProtectionDialog: React.FC<PasswordProtectionDialogProps> = ({ 
  onSubmit, 
  onCancel, 
  type, 
  error, 
  open = true,
  onOpenChange = () => {}
}) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(password);
    } catch (err) {
      console.error('Error submitting password:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            {getTitle(type)}
          </DialogTitle>
          <DialogDescription>
            {getDescription(type)}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? 'border-red-500' : ''}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !password.trim()}
            >
              {isSubmitting ? 'Verificando...' : 'Acceder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordProtectionDialog;
