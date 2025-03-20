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
  // Generate a unique storage key for this section
  const storageKey = activeSection ? `report-edit-content-${activeSection}` : null;
  
  // Initialize from sessionStorage when dialog opens
  useEffect(() => {
    if (open && activeSection && storageKey) {
      const savedContent = sessionStorage.getItem(storageKey);
      if (savedContent) {
        setEditContent(savedContent);
      }
    }
  }, [open, activeSection, storageKey, setEditContent]);

  // Save to sessionStorage when content changes
  useEffect(() => {
    if (activeSection && storageKey && editContent) {
      sessionStorage.setItem(storageKey, editContent);
    }
  }, [activeSection, storageKey, editContent]);

  // Save content to sessionStorage when tab visibility changes
  useEffect(() => {
    if (!activeSection || !storageKey) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && editContent) {
        // When leaving the tab, save the current content
        sessionStorage.setItem(storageKey, editContent);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeSection, storageKey, editContent]);

  // Clean up stored content when dialog is closed
  useEffect(() => {
    if (!open && activeSection && storageKey) {
      // Only remove if the dialog is closed by saving (not by canceling)
      // We'll handle this in the onSave function
    }
  }, [open, activeSection, storageKey]);

  const handleSave = () => {
    onSave();
    // After saving, we can remove the temporary storage
    if (storageKey) {
      sessionStorage.removeItem(storageKey);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Keep the content in storage when canceling in case user accidentally closed the dialog
  };

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
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportEditDialog;
