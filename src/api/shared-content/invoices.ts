
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice, SharedInvoiceResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';
import { logError } from '@/lib/errorLogger';

/**
 * Alias para checkContentExists específico para facturas
 */
export const checkInvoiceExists = async (invoiceId: string): Promise<{ exists: boolean; error: Error | null }> => {
  return checkContentExists(invoiceId, 'invoice');
};

/**
 * Alias para checkContentPasswordProtection específico para facturas
 */
export const checkInvoicePassword = async (invoiceId: string): Promise<{ isProtected: boolean; error: Error | null }> => {
  return checkContentPasswordProtection(invoiceId, 'invoice');
};

/**
 * Alias para verifyContentPassword específico para facturas
 */
export const verifyInvoicePassword = async (invoiceId: string, password: string): Promise<boolean> => {
  return verifyContentPassword(invoiceId, 'invoice', password);
};

/**
 * Alias para logContentAccess específico para facturas
 */
export const logInvoiceAccess = (invoiceId: string, options: AccessLogOptions, eventType: AccessLogType = 'view') => {
  return logContentAccess('invoice', invoiceId, options, eventType);
};

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
      .maybeSingle();
      
    if (error) {
      logError('fetchInvoiceBySharedUrl', error);
      throw error;
    }
    
    if (!data) {
      logInvoiceAccess(sharedUrl, { 
        successful: false, 
        error: 'Invoice not found' 
      }, 'not_found');
      
      return { data: null, error: new Error('Invoice not found') };
    }
    
    // Parse content
    const content = data.content || {};
    
    // Mapear a la estructura de SharedInvoice
    const invoice: SharedInvoice = {
      id: data.id,
      original_id: data.original_id,
      content_type: 'invoice',
      title: data.title,
      description: data.description || '',
      content: content,
      status: data.status,
      shared_url: data.shared_url,
      client_name: data.client_name,
      client_website: data.client_website,
      amount: content.amount || 0,
      due_date: content.due_date,
      payment_method: content.payment_method,
      payment_date: content.payment_date,
      payment_instructions: content.payment_instructions,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    // Registrar acceso exitoso
    logInvoiceAccess(sharedUrl, { successful: true }, 'view');
    
    return { data: invoice, error: null };
  } catch (error: any) {
    logError('fetchInvoiceBySharedUrl', error);
    
    // Registrar acceso fallido
    logInvoiceAccess(sharedUrl, { 
      successful: false, 
      error: error.message || 'Unknown error' 
    }, 'error');
    
    return { data: null, error };
  }
};
