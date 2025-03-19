
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client.types';
import { toast } from 'sonner';

export async function fetchClients(userId: string | undefined) {
  if (!userId) {
    return { clients: [], reportCountMap: {} };
  }

  try {
    // Obtener clientes de Supabase
    const { data: clientsData, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }

    // Obtener conteo de informes para cada cliente
    const { data: reportsCountData, error: reportsError } = await supabase
      .from('reports')
      .select('client_id, id');
      
    if (reportsError) {
      console.error('Error cargando conteo de informes:', reportsError);
    }

    // Crear un mapa de client_id a conteo de informes
    const reportCountMap: Record<string, number> = {};
    if (reportsCountData) {
      reportsCountData.forEach((item: any) => {
        const clientId = item.client_id;
        if (!reportCountMap[clientId]) {
          reportCountMap[clientId] = 0;
        }
        reportCountMap[clientId]++;
      });
    }

    return {
      clients: clientsData || [],
      reportCountMap
    };
  } catch (error: any) {
    console.error('Error loading clients:', error);
    toast.error(error.message || 'Error al cargar clientes');
    return { clients: [], reportCountMap: {} };
  }
}

export async function addClientToDb(
  data: Omit<Client, 'id' | 'createdAt' | 'reportsCount'>, 
  userId: string | undefined
) {
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const { name, website, industry, phoneNumber, wpCredentials, hostingCredentials } = data;
    
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name,
        website,
        industry,
        user_id: userId,
        phone_number: phoneNumber,
        wp_credentials: wpCredentials,
        hosting_credentials: hostingCredentials
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return newClient;
  } catch (error: any) {
    console.error('Error adding client:', error);
    toast.error(error.message || 'Error al añadir cliente');
    throw error;
  }
}

export async function updateClientInDb(
  id: string, 
  data: Partial<Omit<Client, 'id' | 'createdAt' | 'reportsCount'>>
) {
  try {
    // Transform camelCase to snake_case for Supabase
    const transformedData: any = {};
    if (data.name !== undefined) transformedData.name = data.name;
    if (data.website !== undefined) transformedData.website = data.website;
    if (data.industry !== undefined) transformedData.industry = data.industry;
    if (data.phoneNumber !== undefined) transformedData.phone_number = data.phoneNumber;
    if (data.wpCredentials !== undefined) transformedData.wp_credentials = data.wpCredentials;
    if (data.hostingCredentials !== undefined) transformedData.hosting_credentials = data.hostingCredentials;
    
    const { data: updatedClient, error } = await supabase
      .from('clients')
      .update(transformedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return updatedClient;
  } catch (error: any) {
    console.error('Error updating client:', error);
    toast.error(error.message || 'Error al actualizar cliente');
    throw error;
  }
}

export async function deleteClientFromDb(id: string) {
  try {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    console.error('Error deleting client:', error);
    toast.error(error.message || 'Error al eliminar cliente');
    throw error;
  }
}
