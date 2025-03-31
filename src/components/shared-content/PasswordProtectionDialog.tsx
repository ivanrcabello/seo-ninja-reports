
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';

interface PasswordProtectionDialogProps {
  onSubmit: (password: string) => void;
  onCancel: () => void;
  type?: 'invoice' | 'proposal' | 'contract' | 'report';
}

const PasswordProtectionDialog: React.FC<PasswordProtectionDialogProps> = ({
  onSubmit,
  onCancel,
  type = 'invoice'
}) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const typeLabels = {
    invoice: 'factura',
    proposal: 'propuesta',
    contract: 'contrato',
    report: 'informe'
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(password);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background/95">
      <Dialog open={true} onOpenChange={() => onCancel()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Contenido protegido</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Esta {typeLabels[type]} está protegida con contraseña.
              </p>
              <p className="text-sm text-muted-foreground">
                Por favor, introduce la contraseña proporcionada para acceder.
              </p>
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="text-center"
                autoFocus
              />
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row-reverse gap-2 sm:justify-center">
              <Button 
                type="submit" 
                disabled={isSubmitting || !password.trim()}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Verificando...' : 'Acceder'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PasswordProtectionDialog;
