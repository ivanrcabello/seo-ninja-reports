
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice, SharedInvoiceResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Obtiene una factura por su URL compartida
 */
export const fetchInvoiceBySharedUrl = async (sharedUrl: string): Promise<SharedInvoiceResponse> => {
  try {
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', sharedUrl)
      .eq('content_type', 'invoice')
      .single();
    
    if (error) {
      console.error('Error fetching invoice by shared URL:', error);
      return { data: null, error };
    }
    
    return { data: data as SharedInvoice, error: null };
  } catch (error: any) {
    console.error('Error fetching invoice by shared URL:', error);
    return { data: null, error };
  }
};

/**
 * Verifica si una factura existe
 */
export const checkInvoiceExists = async (invoiceId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_exists', {
      content_id: invoiceId,
      content_type: 'invoice'
    });
    
    return !!data;
  } catch (error) {
    console.error('Error checking invoice existence:', error);
    return false;
  }
};

/**
 * Verifica si una factura está protegida con contraseña
 */
export const checkInvoicePassword = async (invoiceId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_shared_content_password', {
      content_id: invoiceId,
      content_type: 'invoice'
    });
    
    return !!data;
  } catch (error) {
    console.error('Error checking invoice password protection:', error);
    return false;
  }
};

/**
 * Verifica la contraseña de una factura
 */
export const verifyInvoicePassword = async (invoiceId: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('verify_shared_content_password', {
      content_id: invoiceId,
      content_type: 'invoice',
      password_param: password
    });
    
    return !!data;
  } catch (error) {
    console.error('Error verifying invoice password:', error);
    return false;
  }
};

/**
 * Registra acceso a una factura compartida
 */
export const logInvoiceAccess = async (
  invoiceId: string,
  options: AccessLogOptions,
  eventType: AccessLogType = 'view'
): Promise<void> => {
  await logContentAccess('invoice', invoiceId, options, eventType);
};
