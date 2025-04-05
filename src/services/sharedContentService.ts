
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
      const contentObj = typeof sharedData.content === 'object' ? sharedData.content : {};
      
      return {
        data: {
          id: sharedData.id,
          title: sharedData.title,
          description: sharedData.description || undefined,
          amount: contentObj.amount ? Number(contentObj.amount) : 0,
          status: contentObj.status || 'pending',
          due_date: contentObj.due_date,
          payment_method: contentObj.payment_method,
          payment_date: contentObj.payment_date,
          payment_instructions: contentObj.payment_instructions,
          shared_url: sharedData.shared_url,
          created_at: sharedData.created_at,
          updated_at: sharedData.updated_at,
          client_name: sharedData.client_name,
          client_website: sharedData.client_website,
          invoice_number: contentObj.invoice_number,
          client_address: contentObj.client_address,
          client_tax_id: contentObj.client_tax_id,
          billing_name: contentObj.billing_name,
          billing_tax_id: contentObj.billing_tax_id,
          billing_address: contentObj.billing_address,
          billing_email: contentObj.billing_email,
          includes_vat: contentObj.includes_vat !== false
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
