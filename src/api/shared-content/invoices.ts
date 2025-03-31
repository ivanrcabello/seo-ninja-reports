
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice, SharedInvoiceResponse, AccessLogOptions, AccessLogType, SharedContentStatus } from '@/types/shared-content';
import { logContentAccess } from './utils';

/**
 * Check if an invoice exists
 */
export const checkInvoiceExists = async (invoiceId: string): Promise<{ exists: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_invoices')
      .select('id')
      .eq('shared_url', invoiceId)
      .maybeSingle();
    
    if (error) throw error;
    
    return { exists: !!data, error: null };
  } catch (error: any) {
    console.error('Error checking if invoice exists:', error);
    return { exists: false, error };
  }
};

/**
 * Check if an invoice is password protected
 */
export const checkInvoicePassword = async (invoiceId: string): Promise<{ isProtected: boolean, error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('public_invoices')
      .select('password')
      .eq('shared_url', invoiceId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Check if data exists and password is not null or empty
    const isProtected = !!(data && data.password && data.password.trim() !== '');
    return { isProtected, error: null };
  } catch (error: any) {
    console.error('Error checking invoice password protection:', error);
    return { isProtected: false, error };
  }
};

/**
 * Verify invoice password
 */
export const verifyInvoicePassword = async (invoiceId: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('public_invoices')
      .select('password')
      .eq('shared_url', invoiceId)
      .single();
    
    if (error) {
      console.error('Error fetching invoice password:', error);
      return false;
    }
    
    // If no password is set, or password matches
    if (!data || !data.password || data.password.trim() === '') {
      return true;
    }
    
    return data.password === password;
  } catch (error) {
    console.error('Error verifying invoice password:', error);
    return false;
  }
};

/**
 * Log invoice access
 */
export const logInvoiceAccess = (invoiceId: string, options: AccessLogOptions, eventType: AccessLogType = 'view') => {
  return logContentAccess('invoice', invoiceId, options, eventType);
};

/**
 * Fetch invoice by shared URL
 */
export const fetchInvoiceBySharedUrl = async (sharedUrl: string): Promise<SharedInvoiceResponse> => {
  try {
    console.log('Fetching invoice with shared URL:', sharedUrl);
    
    const { data, error } = await supabase
      .from('public_invoices')
      .select('*')
      .eq('shared_url', sharedUrl)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { invoice: null, error: new Error('Invoice not found') };
    }
    
    const status = data.status as SharedContentStatus;
    
    // Create a properly typed invoice object
    const invoice: SharedInvoice = {
      id: data.id,
      title: data.title,
      description: data.description,
      amount: data.amount,
      status: status,
      due_date: data.due_date,
      payment_method: data.payment_method,
      payment_date: data.payment_date,
      payment_instructions: data.payment_instructions,
      shared_url: data.shared_url,
      created_at: data.created_at,
      updated_at: data.updated_at,
      client_name: data.client_name,
      client_website: data.client_website
    };
    
    // Log successful access
    logInvoiceAccess(sharedUrl, { successful: true }, 'view');
    
    return { invoice, error: null };
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    
    // Log failed access
    logInvoiceAccess(sharedUrl, { successful: false, error: error.message }, 'error');
    
    return { invoice: null, error };
  }
};
