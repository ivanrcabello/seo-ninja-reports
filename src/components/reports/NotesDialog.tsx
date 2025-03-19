
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

const NotesDialog: React.FC<NotesDialogProps> = ({
  open,
  onOpenChange,
  reportId
}) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch notes when dialog opens
  useEffect(() => {
    if (open && reportId) {
      fetchNotes();
    }
  }, [open, reportId]);
  
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('notes')
        .eq('id', reportId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data && data.notes) {
        setNotes(data.notes);
      } else {
        setNotes('');
      }
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      toast.error('Error al cargar las notas');
    } finally {
      setLoading(false);
    }
  };
  
  const saveNotes = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('reports')
        .update({ notes })
        .eq('id', reportId);
        
      if (error) {
        throw error;
      }
      
      toast.success('Notas guardadas correctamente');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast.error('Error al guardar las notas');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass">
        <DialogHeader>
          <DialogTitle>Notas del informe</DialogTitle>
          <DialogDescription>
            Añade notas privadas sobre este informe. Estas notas no son visibles para los clientes y se utilizarán como información adicional para generar futuros informes.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe tus notas aquí..."
              className="min-h-[300px]"
            />
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={saveNotes} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar notas'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;
