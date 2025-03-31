
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice, SharedInvoiceResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
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
    
    // Create a properly typed invoice object
    const invoice: SharedInvoice = {
      id: data.id,
      title: data.title,
      description: data.description,
      amount: data.amount,
      status: data.status,
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
