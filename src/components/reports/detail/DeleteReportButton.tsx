
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeleteReportButtonProps {
  onDelete: () => Promise<void>;
}

const DeleteReportButton: React.FC<DeleteReportButtonProps> = ({ onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const handleDeleteReport = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      toast({
        title: 'Informe eliminado',
        description: 'El informe ha sido eliminado exitosamente',
      });
    } catch (error: any) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar informe',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Eliminar</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esto eliminará permanentemente este informe.
            Esta acción no puede deshacerse.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteReport}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteReportButton;
