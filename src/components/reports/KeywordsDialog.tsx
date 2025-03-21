
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import KeywordForm from './keywords/KeywordForm';
import KeywordTags from './keywords/KeywordTags';
import { useKeywords } from '@/hooks/useKeywords';

interface KeywordsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

const KeywordsDialog: React.FC<KeywordsDialogProps> = ({
  open,
  onOpenChange,
  reportId
}) => {
  const { 
    keywords, 
    loading, 
    isSaving, 
    fetchKeywords, 
    addKeyword, 
    removeKeyword 
  } = useKeywords(reportId);
  
  // Fetch keywords when dialog opens
  useEffect(() => {
    if (open && reportId) {
      fetchKeywords();
    }
  }, [open, reportId, fetchKeywords]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass">
        <DialogHeader>
          <DialogTitle>Palabras Clave</DialogTitle>
          <DialogDescription>
            Gestiona las palabras clave relacionadas con este informe. Se mostrarán en el informe y se utilizarán para mejorar los análisis futuros.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <KeywordForm onAdd={addKeyword} isSaving={isSaving} />
            
            <div className="space-y-2 mt-4">
              <Label>Palabras Clave Añadidas</Label>
              <KeywordTags keywords={keywords} onRemove={removeKeyword} />
            </div>
          </>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeywordsDialog;
