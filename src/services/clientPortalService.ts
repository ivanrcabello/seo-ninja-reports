
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ClientPortalAccount {
  id: string;
  client_id: string;
  email: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientPortalSession {
  account_id: string;
  client_id: string;
  token: string;
  expires_at: string;
}

export async function createClientPortalAccount(clientId: string, email: string, password: string) {
  try {
    const { data, error } = await supabase.rpc('create_client_portal_account', {
      p_client_id: clientId,
      p_email: email,
      p_password: password
    });

    if (error) throw error;
    
    toast.success('Cuenta del portal de cliente creada exitosamente');
    return data;
  } catch (error: any) {
    console.error('Error creating client portal account:', error);
    toast.error(error.message || 'Error al crear cuenta de portal de cliente');
    throw error;
  }
}

export async function getClientPortalAccounts(clientId: string) {
  try {
    const { data, error } = await supabase
      .from('client_portal_accounts')
      .select('*')
      .eq('client_id', clientId);
    
    if (error) throw error;
    
    return data as ClientPortalAccount[];
  } catch (error: any) {
    console.error('Error fetching client portal accounts:', error);
    toast.error(error.message || 'Error al obtener cuentas de portal de cliente');
    return [];
  }
}

export async function updateClientPortalAccount(accountId: string, updates: Partial<ClientPortalAccount>) {
  try {
    const { data, error } = await supabase
      .from('client_portal_accounts')
      .update(updates)
      .eq('id', accountId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Cuenta actualizada exitosamente');
    return data as ClientPortalAccount;
  } catch (error: any) {
    console.error('Error updating client portal account:', error);
    toast.error(error.message || 'Error al actualizar cuenta de portal');
    throw error;
  }
}

export async function deactivateClientPortalAccount(accountId: string) {
  return updateClientPortalAccount(accountId, { is_active: false });
}

export async function activateClientPortalAccount(accountId: string) {
  return updateClientPortalAccount(accountId, { is_active: true });
}

export async function deleteClientPortalAccount(accountId: string) {
  try {
    const { error } = await supabase
      .from('client_portal_accounts')
      .delete()
      .eq('id', accountId);
    
    if (error) throw error;
    
    toast.success('Cuenta eliminada exitosamente');
    return true;
  } catch (error: any) {
    console.error('Error deleting client portal account:', error);
    toast.error(error.message || 'Error al eliminar cuenta de portal');
    throw error;
  }
}

export async function getClientPortalActivity(accountId: string) {
  try {
    const { data, error } = await supabase
      .from('client_portal_activity_logs')
      .select('*')
      .eq('client_portal_account_id', accountId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching client portal activity:', error);
    toast.error(error.message || 'Error al obtener actividad del portal');
    return [];
  }
}

// Estas funciones serán utilizadas por la aplicación del portal del cliente (separada)
export async function authenticateClientPortal(email: string, password: string): Promise<ClientPortalSession | null> {
  try {
    const { data, error } = await supabase.rpc('authenticate_client_portal_account', {
      p_email: email,
      p_password: password
    });

    if (error) throw error;
    
    // Asegurarse de que estamos devolviendo un objeto único, no un array
    if (!data) return null;
    
    // Si es un array, tomamos el primer elemento
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as ClientPortalSession;
    }
    
    // Si no es un array, devolvemos el objeto directamente
    return data as ClientPortalSession;
  } catch (error: any) {
    console.error('Error authenticating client portal:', error);
    throw error;
  }
}

export async function logoutClientPortal(token: string) {
  try {
    const { data, error } = await supabase.rpc('invalidate_client_portal_session', {
      p_token: token
    });

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error logging out client portal:', error);
    throw error;
  }
}
