
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface ReportEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSection: string | null;
  editContent: string;
  setEditContent: (content: string) => void;
  onSave: () => void;
  getSectionTitle: (section: string) => string;
}

const ReportEditDialog: React.FC<ReportEditDialogProps> = ({
  open,
  onOpenChange,
  activeSection,
  editContent,
  setEditContent,
  onSave,
  getSectionTitle
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass">
        <DialogHeader>
          <DialogTitle>Editar {activeSection ? getSectionTitle(activeSection) : ''}</DialogTitle>
          <DialogDescription>
            Modifica el contenido de esta sección del informe.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[300px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportEditDialog;
