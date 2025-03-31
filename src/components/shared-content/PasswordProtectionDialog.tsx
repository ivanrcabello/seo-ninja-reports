
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Loader2 } from 'lucide-react';
import { SharedContentType } from '@/types/shared-content';

interface PasswordProtectionDialogProps {
  onSubmit: (password: string) => Promise<void> | void;
  onCancel?: () => void;
  type: SharedContentType;
}

const PasswordProtectionDialog: React.FC<PasswordProtectionDialogProps> = ({
  onSubmit,
  onCancel,
  type
}) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const contentTypeLabels = {
    report: 'informe',
    proposal: 'propuesta',
    contract: 'contrato',
    invoice: 'factura'
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Por favor, introduce la contraseña');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(password);
    } catch (err: any) {
      setError(err.message || 'Error al verificar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    if (onCancel) onCancel();
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-md w-full p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-primary/10">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Contenido protegido</h1>
          <p className="text-center text-muted-foreground">
            Este {contentTypeLabels[type]} está protegido con contraseña.
            Por favor, introduce la contraseña para acceder.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-between sm:justify-end">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
      </div>
    </div>
  );
};

export default PasswordProtectionDialog;
