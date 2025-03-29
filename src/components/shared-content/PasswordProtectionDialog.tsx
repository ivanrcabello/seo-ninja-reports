
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';

interface PasswordProtectionDialogProps {
  onSubmit: (password: string) => void;
  onCancel: () => void;
  type?: 'report' | 'invoice' | 'proposal' | 'contract';
  error?: string | null;
}

const PasswordProtectionDialog: React.FC<PasswordProtectionDialogProps> = ({ 
  onSubmit, 
  onCancel, 
  type = 'report',
  error
}) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  const getTitle = () => {
    switch(type) {
      case 'invoice': return 'Factura Protegida';
      case 'proposal': return 'Propuesta Protegida';
      case 'contract': return 'Contrato Protegido';
      default: return 'Informe Protegido';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full inline-flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">{getTitle()}</h2>
          <p className="text-muted-foreground mt-2">
            Este contenido está protegido por contraseña. Por favor, introduce la contraseña para acceder.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="outline"
              type="button" 
              onClick={onCancel}
              className="sm:flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="sm:flex-1"
            >
              Acceder
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtectionDialog;
