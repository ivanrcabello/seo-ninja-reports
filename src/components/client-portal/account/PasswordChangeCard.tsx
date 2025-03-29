
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PasswordChangeCardProps {
  accountId: string;
}

const PasswordChangeCard: React.FC<PasswordChangeCardProps> = ({ accountId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    setIsChangingPassword(true);
    
    try {
      // Get client token from localStorage
      const clientToken = localStorage.getItem('clientPortalSession') 
        ? JSON.parse(localStorage.getItem('clientPortalSession')!).token 
        : null;
        
      if (!clientToken) {
        throw new Error('Session token not found. Please log in again.');
      }
      
      // Call the edge function with the client token in headers
      const { data, error } = await supabase.functions.invoke('change-client-password', {
        body: {
          accountId: accountId,
          currentPassword: currentPassword,
          newPassword: newPassword
        },
        headers: {
          'x-client-token': clientToken
        }
      });

      if (error) throw error;
      
      if (data && data.success) {
        toast.success('Contraseña actualizada correctamente');
        
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.');
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      toast.error('Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="mr-2 h-5 w-5" /> Cambiar Contraseña
        </CardTitle>
        <CardDescription>
          Actualiza tu contraseña de acceso al portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña Actual</Label>
            <Input 
              id="current-password" 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva Contraseña</Label>
            <Input 
              id="new-password" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" disabled={isChangingPassword} className="w-full">
            {isChangingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeCard;
