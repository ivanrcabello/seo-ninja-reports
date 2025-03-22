
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

interface DeleteSeoReportButtonProps {
  onDelete: () => void;
}

const DeleteSeoReportButton: React.FC<DeleteSeoReportButtonProps> = ({ onDelete }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => setShowConfirmDialog(true)}
      >
        <Trash2 className="h-4 w-4" />
        <span>Eliminar</span>
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente este informe SEO
              y todos los datos asociados del servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete();
                setShowConfirmDialog(false);
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteSeoReportButton;
