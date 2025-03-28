
import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface PasswordProtectionDialogProps {
  onSubmit: (password: string) => Promise<void>;
  onCancel: () => void;
  type: 'invoice' | 'proposal' | 'report' | 'contract';
}

const PasswordProtectionDialog: React.FC<PasswordProtectionDialogProps> = ({ 
  onSubmit, 
  onCancel,
  type
}) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(password);
    } catch (error) {
      console.error("Error submitting password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeLabels = {
    invoice: 'factura',
    proposal: 'propuesta',
    report: 'informe',
    contract: 'contrato'
  };
  
  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto rounded-full bg-primary/10 p-3 mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <AlertDialogTitle className="text-center">
            {`Este ${typeLabels[type]} está protegido con contraseña`}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Por favor, ingrese la contraseña para ver el contenido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-center"
            autoFocus
            required
          />
          
          <AlertDialogFooter className="sm:justify-center gap-2 flex-row">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!password || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Verificando...
                </span>
              ) : (
                'Acceder'
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasswordProtectionDialog;
