
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientNote {
  id: string;
  clientId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchClientNotes(clientId: string): Promise<ClientNote[]> {
  try {
    const { data, error } = await supabase
      .from('client_notes')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Transformar los nombres de columnas snake_case a camelCase
    return data.map((note) => ({
      id: note.id,
      clientId: note.client_id,
      content: note.content,
      createdAt: note.created_at,
      updatedAt: note.updated_at
    }));
  } catch (error: any) {
    console.error('Error fetching client notes:', error);
    toast.error(error.message || 'Error al cargar las notas del cliente');
    return [];
  }
}

export async function addClientNote(clientId: string, content: string): Promise<ClientNote | null> {
  try {
    const { data, error } = await supabase
      .from('client_notes')
      .insert({
        client_id: clientId,
        content
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transformar los nombres de columnas snake_case a camelCase
    return {
      id: data.id,
      clientId: data.client_id,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    console.error('Error adding client note:', error);
    toast.error(error.message || 'Error al añadir la nota');
    return null;
  }
}

export async function updateClientNote(noteId: string, content: string): Promise<ClientNote | null> {
  try {
    const { data, error } = await supabase
      .from('client_notes')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transformar los nombres de columnas snake_case a camelCase
    return {
      id: data.id,
      clientId: data.client_id,
      content: data.content,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error: any) {
    console.error('Error updating client note:', error);
    toast.error(error.message || 'Error al actualizar la nota');
    return null;
  }
}

export async function deleteClientNote(noteId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('client_notes')
      .delete()
      .eq('id', noteId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error deleting client note:', error);
    toast.error(error.message || 'Error al eliminar la nota');
    return false;
  }
}
