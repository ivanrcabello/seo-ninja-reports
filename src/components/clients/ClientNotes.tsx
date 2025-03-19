
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, Loader2, MessageSquarePlus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ClientNote, fetchClientNotes, addClientNote, updateClientNote, deleteClientNote } from '@/services/clientNotesService';

interface ClientNotesProps {
  clientId: string;
}

const ClientNotes: React.FC<ClientNotesProps> = ({ clientId }) => {
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<ClientNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [clientId]);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const clientNotes = await fetchClientNotes(clientId);
      setNotes(clientNotes);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNote.trim()) {
      toast.error('El contenido de la nota no puede estar vacío');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const addedNote = await addClientNote(clientId, newNote);
      if (addedNote) {
        setNotes([addedNote, ...notes]);
        setNewNote('');
        toast.success('Nota añadida correctamente');
        setIsAddingNote(false);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingNote || !editingNote.content.trim()) {
      toast.error('El contenido de la nota no puede estar vacío');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const updatedNote = await updateClientNote(editingNote.id, editingNote.content);
      if (updatedNote) {
        setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
        setEditingNote(null);
        toast.success('Nota actualizada correctamente');
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    
    try {
      const success = await deleteClientNote(noteToDelete);
      if (success) {
        setNotes(notes.filter(note => note.id !== noteToDelete));
        toast.success('Nota eliminada correctamente');
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setNoteToDelete(null);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-xl">
          <MessageSquare className="mr-2 h-5 w-5 text-primary" />
          Notas internas
        </CardTitle>
        {!isAddingNote && (
          <Button 
            onClick={() => setIsAddingNote(true)} 
            size="sm" 
            className="h-8"
          >
            <MessageSquarePlus className="mr-1 h-4 w-4" />
            Añadir nota
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingNote && (
          <form onSubmit={handleSubmitNote} className="mb-6 space-y-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Escribe una nota sobre este cliente..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddingNote(false);
                  setNewNote('');
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !newNote.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : 'Guardar nota'}
              </Button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>No hay notas registradas para este cliente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="bg-card/50 p-4 rounded-lg border shadow-sm"
              >
                {editingNote && editingNote.id === note.id ? (
                  <form onSubmit={handleUpdateNote} className="space-y-4">
                    <Textarea
                      value={editingNote.content}
                      onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingNote(null)}
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !editingNote.content.trim()}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Actualizando...
                          </>
                        ) : 'Actualizar'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(note.createdAt), 'dd/MM/yyyy HH:mm')}
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => setEditingNote(note)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive"
                          onClick={() => setNoteToDelete(note.id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="whitespace-pre-wrap text-sm">
                      {note.content}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <AlertDialog open={!!noteToDelete} onOpenChange={(open) => !open && setNoteToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esta nota será eliminada permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteNote}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default ClientNotes;
