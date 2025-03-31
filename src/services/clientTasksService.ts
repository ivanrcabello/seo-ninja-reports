
import { supabase } from '@/integrations/supabase/client';
import { ClientTask, ClientTaskInput } from '@/types/client.types';
import { toast } from 'sonner';

export async function fetchClientTasks(clientId: string | undefined) {
  if (!clientId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('client_tasks')
      .select('*')
      .eq('client_id', clientId)
      .order('due_date', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    return data as ClientTask[];
  } catch (error: any) {
    console.error('Error loading client tasks:', error);
    toast.error(error.message || 'Error al cargar tareas del cliente');
    return [];
  }
}

export async function addClientTask(
  clientId: string, 
  taskData: ClientTaskInput
) {
  try {
    const { data, error } = await supabase
      .from('client_tasks')
      .insert({
        client_id: clientId,
        ...taskData
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as ClientTask;
  } catch (error: any) {
    console.error('Error adding client task:', error);
    toast.error(error.message || 'Error al añadir tarea');
    throw error;
  }
}

export async function updateClientTask(
  taskId: string, 
  taskData: Partial<ClientTaskInput>
) {
  try {
    const { data, error } = await supabase
      .from('client_tasks')
      .update(taskData)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data as ClientTask;
  } catch (error: any) {
    console.error('Error updating client task:', error);
    toast.error(error.message || 'Error al actualizar tarea');
    throw error;
  }
}

export async function deleteClientTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('client_tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Error deleting client task:', error);
    toast.error(error.message || 'Error al eliminar tarea');
    throw error;
  }
}
