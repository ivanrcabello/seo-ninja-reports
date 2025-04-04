
import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetSystem = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    setConfirmText('');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setConfirmText('');
  };

  const resetSystem = async () => {
    setIsDeleting(true);
    try {
      // Eliminar todos los datos en orden para respetar las restricciones de clave foránea
      // 1. Eliminar datos relacionados con clientes primero
      await supabase.from('client_notes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('client_tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('keywords').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('shared_content').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('client_invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('client_proposals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('client_contracts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Eliminar registros del portal del cliente
      await supabase.from('client_portal_invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('client_portal_proposals').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('client_portal_reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('client_portal_contracts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Eliminar sesiones y actividad de portal
      await supabase.from('client_portal_activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('client_portal_sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Eliminar las cuentas del portal
      await supabase.from('client_portal_accounts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Eliminar datos de SEO y crawl
      await supabase.from('seo_crawler_headings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('seo_crawler_issues').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('seo_crawler_links').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('seo_crawler_pages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('seo_crawler_crawls').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('seo_crawler_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      // Finalmente, eliminar los clientes
      await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      toast.success('Sistema reiniciado correctamente. Se han eliminado todos los datos.');
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error al reiniciar el sistema:', error);
      toast.error(`Error al reiniciar el sistema: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmReset = () => {
    if (confirmText.toLowerCase() === 'eliminar todo') {
      resetSystem();
    } else {
      toast.error('El texto de confirmación no es correcto');
    }
  };

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
        <CardDescription>
          Estas acciones son irreversibles y permanentes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 bg-destructive/10 flex items-start gap-4">
          <AlertTriangle className="text-destructive h-5 w-5 mt-0.5" />
          <div>
            <h4 className="font-medium">Reinicio Completo del Sistema</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Esta acción eliminará permanentemente todos los clientes, informes, contratos, propuestas,
              facturas y todo el contenido relacionado. Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          onClick={handleOpenDialog}
          className="w-full sm:w-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Reiniciar Sistema
        </Button>
      </CardFooter>

      {/* Diálogo de confirmación */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará TODOS los datos del sistema. No hay forma de recuperar esta información.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 border rounded-md bg-destructive/10 my-4">
            <p className="text-sm font-medium">Para confirmar, escribe "eliminar todo" en el campo de abajo:</p>
            <Input 
              value={confirmText} 
              onChange={(e) => setConfirmText(e.target.value)} 
              className="mt-2" 
              placeholder="eliminar todo"
            />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleConfirmReset}
              disabled={confirmText.toLowerCase() !== 'eliminar todo' || isDeleting}
            >
              {isDeleting ? (
                <>Eliminando...</>
              ) : (
                <>Confirmar eliminación</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ResetSystem;
