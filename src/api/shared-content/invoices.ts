
import { supabase } from '@/integrations/supabase/client';
import { SharedInvoice, SharedInvoiceResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logContentAccess, checkContentExists, checkContentPasswordProtection, verifyContentPassword } from './utils';
import { logError } from '@/lib/errorLogger';
import { SharedContentRow } from '@/types/supabase-types';

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
      .single();
      
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
    
    const rowData = data as SharedContentRow;
    
    // Parse content
    const contentObj = rowData.content || {};
    
    // Mapear a la estructura de SharedInvoice
    const invoice: SharedInvoice = {
      id: rowData.id,
      original_id: rowData.original_id,
      content_type: 'invoice',
      title: rowData.title,
      description: rowData.description || '',
      content: contentObj,
      status: rowData.status as any,
      shared_url: rowData.shared_url,
      client_name: rowData.client_name,
      client_website: rowData.client_website,
      amount: contentObj.amount || 0,
      due_date: contentObj.due_date,
      payment_method: contentObj.payment_method,
      payment_date: contentObj.payment_date,
      payment_instructions: contentObj.payment_instructions,
      created_at: rowData.created_at,
      updated_at: rowData.updated_at
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
