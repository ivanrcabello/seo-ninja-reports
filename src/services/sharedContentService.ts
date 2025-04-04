import { supabase } from '@/integrations/supabase/client';
import { 
  SharedInvoiceResponse, 
  SharedProposalResponse, 
  SharedContractResponse, 
  SharedReportResponse 
} from '@/types/shared-content';

export async function getSharedInvoice(sharedUrl: string): Promise<SharedInvoiceResponse> {
  try {
    // First check shared_content table
    const { data: sharedData, error: sharedError } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', sharedUrl)
      .eq('content_type', 'invoice')
      .single();
    
    if (sharedError && sharedError.code !== 'PGRST116') {
      throw sharedError;
    }
    
    if (sharedData) {
      // If found in shared_content, format and return
      return {
        data: {
          id: sharedData.id,
          title: sharedData.title,
          description: sharedData.description || undefined,
          amount: sharedData.content?.amount || 0,
          status: sharedData.content?.status || 'pending',
          due_date: sharedData.due_date,
          payment_method: sharedData.content?.payment_method,
          payment_date: sharedData.content?.payment_date,
          payment_instructions: sharedData.payment_instructions,
          shared_url: sharedData.shared_url,
          created_at: sharedData.created_at,
          updated_at: sharedData.updated_at,
          client_name: sharedData.client_name,
          client_website: sharedData.client_website,
          client_address: sharedData.client_address,
          client_tax_id: sharedData.client_tax_id,
          billing_name: sharedData.billing_name,
          billing_tax_id: sharedData.billing_tax_id,
          billing_address: sharedData.billing_address,
          billing_email: sharedData.billing_email,
          includes_vat: sharedData.includes_vat
        }
      };
    }
    
    // If not found in shared_content, try to get directly from client_invoices
    const { data, error } = await supabase
      .rpc('get_public_invoice_by_shared_url', {
        shared_url_param: sharedUrl
      });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return { data: null, error: 'Factura no encontrada' };
    }
    
    const invoice = data[0];
    
    return { data: invoice };
  } catch (error: any) {
    console.error('Error fetching shared invoice:', error);
    return { data: null, error: error.message || 'Error al obtener la factura' };
  }
}

// Keep the rest of the service functions as they are
