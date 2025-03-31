
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';

/**
 * Check if an invoice exists
 */
export const checkInvoiceExists = async (invoiceId: string): Promise<{ exists: boolean, error: Error | null }> => {
  return checkContentExists(invoiceId, 'invoice');
};

/**
 * Check if an invoice is password protected
 */
export const checkInvoicePassword = async (invoiceId: string): Promise<{ isProtected: boolean, error: Error | null }> => {
  return checkContentPasswordProtection(invoiceId, 'invoice');
};

/**
 * Verify an invoice's password
 */
export const verifyInvoicePassword = async (invoiceId: string, password: string): Promise<boolean> => {
  return verifyContentPassword(invoiceId, 'invoice', password);
};

/**
 * Log invoice access
 */
export const logInvoiceAccess = (invoiceId: string, options: any, eventType: string = 'access') => {
  return logContentAccess(invoiceId, 'invoice', options, eventType);
};

/**
 * Fetch invoice by shared URL
 */
export const fetchInvoiceBySharedUrl = async (sharedUrl: string): Promise<{ invoice: SharedInvoice | null, error: Error | null }> => {
  try {
    console.log('Fetching invoice with shared URL:', sharedUrl);
    
    const { data, error } = await supabase.rpc('get_invoice_by_shared_url', {
      shared_url_param: sharedUrl
    });
    
    if (error) throw error;
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return { invoice: null, error: new Error('Invoice not found') };
    }
    
    // Handle the case when data is an array
    const invoiceData = Array.isArray(data) ? data[0] : data;
    
    // Create a properly typed invoice object
    const invoice: SharedInvoice = {
      id: invoiceData.id,
      title: invoiceData.title,
      description: invoiceData.description,
      amount: invoiceData.amount,
      status: invoiceData.status,
      due_date: invoiceData.due_date,
      payment_method: invoiceData.payment_method,
      payment_date: invoiceData.payment_date,
      payment_instructions: invoiceData.payment_instructions,
      shared_url: invoiceData.shared_url,
      created_at: invoiceData.created_at,
      updated_at: invoiceData.updated_at,
      client_name: invoiceData.client_name,
      client_website: invoiceData.client_website
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
