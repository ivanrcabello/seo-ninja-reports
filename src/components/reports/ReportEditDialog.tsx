
import React, { useEffect } from 'react';
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
  // Save the current edit content to sessionStorage when tab changes
  useEffect(() => {
    if (!activeSection) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When coming back to the tab, try to restore from sessionStorage
        const savedContent = sessionStorage.getItem(`report-edit-content-${activeSection}`);
        if (savedContent) {
          setEditContent(savedContent);
        }
      } else {
        // When leaving the tab, save the current content
        sessionStorage.setItem(`report-edit-content-${activeSection}`, editContent);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeSection, editContent, setEditContent]);

  // Clean up stored content when dialog is closed
  useEffect(() => {
    if (!open && activeSection) {
      // When dialog is closed, remove the saved content from sessionStorage
      sessionStorage.removeItem(`report-edit-content-${activeSection}`);
    }
  }, [open, activeSection]);

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
