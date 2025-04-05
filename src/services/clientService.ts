import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client.types';
import { toast } from 'sonner';
import { handleServiceError } from './api/baseService';

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
  data: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>, 
  userId: string | undefined
) {
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const { name, website, industry, phone_number, active, wp_credentials, hosting_credentials } = data;
    
    // Process wp_credentials to ensure URL field consistency
    let processedWpCredentials = null;
    if (wp_credentials) {
      processedWpCredentials = {
        ...wp_credentials,
        // Ensure admin_url is set if it's coming in the url field
        admin_url: wp_credentials.admin_url || wp_credentials.url
      };
    }
    
    const { data: newClient, error } = await supabase
      .from('clients')
      .insert({
        name,
        website,
        industry,
        user_id: userId,
        phone_number,
        active,
        wp_credentials: processedWpCredentials,
        hosting_credentials: hosting_credentials || null
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
  data: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>>
) {
  try {
    // Transform camelCase to snake_case for Supabase
    const transformedData: any = {};
    if (data.name !== undefined) transformedData.name = data.name;
    if (data.website !== undefined) transformedData.website = data.website;
    if (data.industry !== undefined) transformedData.industry = data.industry;
    if (data.phone_number !== undefined) transformedData.phone_number = data.phone_number;
    if (data.active !== undefined) transformedData.active = data.active;
    
    // Process wp_credentials to ensure URL field consistency
    if (data.wp_credentials !== undefined) {
      if (data.wp_credentials && data.wp_credentials.url && !data.wp_credentials.admin_url) {
        transformedData.wp_credentials = {
          ...data.wp_credentials,
          admin_url: data.wp_credentials.url
        };
      } else {
        transformedData.wp_credentials = data.wp_credentials;
      }
    }
    
    if (data.hosting_credentials !== undefined) transformedData.hosting_credentials = data.hosting_credentials;
    
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
    console.log('Deleting client with ID:', id);
    
    // First delete related google business listings
    const { error: businessListingsError } = await supabase
      .from('google_business_listings')
      .delete()
      .eq('client_id', id);
    
    if (businessListingsError) {
      console.error('Error deleting business listings:', businessListingsError);
      throw businessListingsError;
    }
    
    // Delete client tasks
    const { error: tasksError } = await supabase
      .from('client_tasks')
      .delete()
      .eq('client_id', id);
    
    if (tasksError) {
      console.error('Error deleting client tasks:', tasksError);
      // Continue with deletion even if this fails
    }
    
    // Delete client notes
    const { error: notesError } = await supabase
      .from('client_notes')
      .delete()
      .eq('client_id', id);
    
    if (notesError) {
      console.error('Error deleting client notes:', notesError);
      // Continue with deletion even if this fails
    }
    
    // Delete client invoices
    const { error: invoicesError } = await supabase
      .from('client_invoices')
      .delete()
      .eq('client_id', id);
    
    if (invoicesError) {
      console.error('Error deleting client invoices:', invoicesError);
      // Continue with deletion even if this fails
    }
    
    // Delete client proposals
    const { error: proposalsError } = await supabase
      .from('client_proposals')
      .delete()
      .eq('client_id', id);
    
    if (proposalsError) {
      console.error('Error deleting client proposals:', proposalsError);
      // Continue with deletion even if this fails
    }
    
    // Delete client contracts
    const { error: contractsError } = await supabase
      .from('client_contracts')
      .delete()
      .eq('client_id', id);
    
    if (contractsError) {
      console.error('Error deleting client contracts:', contractsError);
      // Continue with deletion even if this fails
    }
    
    // Delete related data in reports table
    const { error: reportsError } = await supabase
      .from('reports')
      .delete()
      .eq('client_id', id);
    
    if (reportsError) {
      console.error('Error deleting reports:', reportsError);
      // Continue with deletion even if this fails
    }
    
    // Handle any crawl data related to the client
    const { error: crawlsError } = await supabase
      .from('seo_crawler_crawls')
      .delete()
      .eq('client_id', id);
    
    if (crawlsError) {
      console.error('Error deleting crawl data:', crawlsError);
      // Continue with deletion even if this fails
    }
    
    // Finally delete the client record
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
    
    console.log('Client deleted successfully');
  } catch (error: any) {
    console.error('Error in deleteClientFromDb:', error);
    throw error; // Rethrow to be handled by the calling function
  }
}
