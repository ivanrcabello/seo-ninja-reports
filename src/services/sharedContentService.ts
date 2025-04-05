
import { supabase } from '@/integrations/supabase/client';
import { 
  SharedInvoiceResponse, 
  SharedProposalResponse, 
  SharedContractResponse, 
  SharedReportResponse 
} from '@/types/shared-content';
import { Json } from '@/integrations/supabase/types';

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
      console.log('Shared content data found:', sharedData);
      
      // Ensure content is an object before accessing properties
      const contentObj = typeof sharedData.content === 'object' && sharedData.content !== null && !Array.isArray(sharedData.content)
        ? (sharedData.content as Record<string, any>)
        : {};
      
      console.log('Content object from shared_content:', contentObj);
      
      return {
        data: {
          id: sharedData.id,
          title: sharedData.title,
          description: sharedData.description || undefined,
          amount: typeof contentObj.amount === 'number' ? contentObj.amount : 0,
          status: (contentObj.status as string) || 'pending',
          due_date: contentObj.due_date as string | undefined,
          payment_method: contentObj.payment_method as string | undefined,
          payment_date: contentObj.payment_date as string | undefined,
          payment_instructions: contentObj.payment_instructions as string | undefined,
          shared_url: sharedData.shared_url,
          created_at: sharedData.created_at,
          updated_at: sharedData.updated_at,
          client_name: sharedData.client_name || 'Cliente',
          client_website: sharedData.client_website || undefined,
          invoice_number: contentObj.invoice_number as string | undefined,
          client_address: contentObj.client_address as string | undefined,
          client_tax_id: contentObj.client_tax_id as string | undefined,
          billing_name: contentObj.billing_name as string | undefined,
          billing_tax_id: contentObj.billing_tax_id as string | undefined,
          billing_address: contentObj.billing_address as string | undefined,
          billing_email: contentObj.billing_email as string | undefined,
          billing_phone: contentObj.billing_phone as string | undefined,
          includes_vat: contentObj.includes_vat !== false
        }
      };
    }
    
    // If not found in shared_content, try to get directly from client_invoices
    console.log('Fetching invoice from RPC function with shared URL:', sharedUrl);
    const { data, error } = await supabase
      .rpc('get_public_invoice_by_shared_url', {
        shared_url_param: sharedUrl
      });
    
    if (error) {
      console.error('RPC error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error('No invoice data returned from RPC');
      return { data: null, error: 'Factura no encontrada' };
    }
    
    const invoice = data[0] as SharedInvoiceResponse['data'];
    console.log('Invoice data from RPC:', invoice);
    
    // Fetch fiscal settings for billing information if not present in invoice data
    const { data: fiscalSettings, error: fiscalError } = await supabase
      .from('fiscal_settings')
      .select('*')
      .limit(1)
      .single();
      
    if (fiscalError && fiscalError.code !== 'PGRST116') {
      console.error('Error fetching fiscal settings:', fiscalError);
    }
    
    // Ensure the invoice object has all needed properties
    if (invoice && fiscalSettings) {
      console.log('Fiscal settings found:', fiscalSettings);
      if (!invoice.billing_name) invoice.billing_name = fiscalSettings.company_name || '';
      if (!invoice.billing_tax_id) invoice.billing_tax_id = fiscalSettings.tax_id || '';
      if (!invoice.billing_address) invoice.billing_address = fiscalSettings.address ? `${fiscalSettings.address}, ${fiscalSettings.postal_code || ''} ${fiscalSettings.city || ''}, ${fiscalSettings.province || ''}, ${fiscalSettings.country || ''}` : '';
      if (!invoice.billing_email) invoice.billing_email = fiscalSettings.email || '';
      if (!invoice.billing_phone) invoice.billing_phone = fiscalSettings.phone || '';
    }
    
    // Log the access for analytics purposes
    try {
      await supabase.rpc('log_shared_content_access', {
        content_type: 'invoice',
        content_id: sharedUrl,
        access_type: 'view',
        successful: true
      });
    } catch (logError) {
      console.error('Error logging access:', logError);
      // Don't fail if logging fails
    }
    
    return { data: invoice };
  } catch (error: any) {
    console.error('Error fetching shared invoice:', error);
    
    // Log the error
    try {
      await supabase.rpc('log_shared_content_access', {
        content_type: 'invoice',
        content_id: sharedUrl || 'unknown',
        access_type: 'view',
        successful: false,
        error_message: error.message || 'Unknown error'
      });
    } catch (logError) {
      console.error('Error logging access error:', logError);
    }
    
    return { data: null, error: error.message || 'Error al obtener la factura' };
  }
}

export async function getSharedReport(sharedUrl: string): Promise<SharedReportResponse> {
  try {
    const { data, error } = await supabase
      .rpc('get_report_by_shared_url', {
        shared_url_param: sharedUrl
      });
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return { data: null, error: 'Informe no encontrado' };
    }
    
    const report = data[0];
    return { data: report };
  } catch (error: any) {
    console.error('Error fetching shared report:', error);
    return { data: null, error: error.message || 'Error al obtener el informe' };
  }
}

export async function getSharedProposal(sharedUrl: string): Promise<SharedProposalResponse> {
  try {
    const { data, error } = await supabase
      .rpc('get_proposal_by_shared_url', {
        shared_url_param: sharedUrl
      });
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return { data: null, error: 'Propuesta no encontrada' };
    }
    
    const proposal = data[0];
    return { data: proposal };
  } catch (error: any) {
    console.error('Error fetching shared proposal:', error);
    return { data: null, error: error.message || 'Error al obtener la propuesta' };
  }
}

export async function getSharedContract(sharedUrl: string): Promise<SharedContractResponse> {
  try {
    const { data, error } = await supabase
      .rpc('get_contract_by_shared_url', {
        shared_url_param: sharedUrl
      });
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return { data: null, error: 'Contrato no encontrado' };
    }
    
    const contract = data[0];
    return { data: contract };
  } catch (error: any) {
    console.error('Error fetching shared contract:', error);
    return { data: null, error: error.message || 'Error al obtener el contrato' };
  }
}
