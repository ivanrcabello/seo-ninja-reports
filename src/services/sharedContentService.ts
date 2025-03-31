
import { supabase } from '@/integrations/supabase/client';
import { SharedContentType, SharedReportResponse, SharedProposalResponse, SharedContractResponse, SharedInvoiceResponse } from '@/types/shared-content';
import { logSharedContentAccess } from '@/api/shared-content/utils';

export const getSharedReport = async (id: string): Promise<SharedReportResponse> => {
  try {
    // Log access attempt
    await logSharedContentAccess({
      contentType: 'report',
      contentId: id,
      accessType: 'view'
    });

    // Fetch the shared report
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', id)
      .eq('content_type', 'report')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Report not found');

    // Check if password protected
    const isPasswordProtected = data.password ? true : false;
    
    // Process content to ensure it's properly typed
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    
    // Return report data with password protection status
    return {
      data: {
        id: data.original_id,
        title: data.title,
        summary: data.description,
        content: content,
        date: data.created_at,
        client_name: data.client_name,
        client_website: data.client_website
      },
      isPasswordProtected
    };
  } catch (error: any) {
    console.error('Error fetching shared report:', error);
    
    // Log failed access
    await logSharedContentAccess({
      contentType: 'report',
      contentId: id,
      accessType: 'view',
      options: {
        success: false,
        error_message: error.message
      }
    });
    
    return {
      data: null,
      error: error.message || 'Error fetching shared report'
    };
  }
};

export const getSharedProposal = async (id: string): Promise<SharedProposalResponse> => {
  try {
    // Log access attempt
    await logSharedContentAccess({
      contentType: 'proposal',
      contentId: id,
      accessType: 'view'
    });

    // Fetch the shared proposal
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', id)
      .eq('content_type', 'proposal')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Proposal not found');

    // Check if password protected
    const isPasswordProtected = data.password ? true : false;
    
    // Process content to ensure it's properly typed
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content || {};
    
    // Return proposal data
    return {
      data: {
        id: data.original_id,
        title: data.title,
        description: data.description,
        services: content.services || [],
        status: data.status,
        price: content.price,
        shared_url: data.shared_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        client_name: data.client_name,
        client_website: data.client_website
      },
      isPasswordProtected
    };
  } catch (error: any) {
    console.error('Error fetching shared proposal:', error);
    
    // Log failed access
    await logSharedContentAccess({
      contentType: 'proposal',
      contentId: id,
      accessType: 'view',
      options: {
        success: false,
        error_message: error.message
      }
    });
    
    return {
      data: null,
      error: error.message || 'Error fetching shared proposal'
    };
  }
};

export const getSharedContract = async (id: string): Promise<SharedContractResponse> => {
  try {
    // Log access attempt
    await logSharedContentAccess({
      contentType: 'contract',
      contentId: id,
      accessType: 'view'
    });

    // Fetch the shared contract
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', id)
      .eq('content_type', 'contract')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Contract not found');
    
    // Process content to ensure it's properly typed
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content || {};

    // Ensure status is one of the valid types
    const validStatuses = ['draft', 'sent', 'signed', 'expired', 'cancelled'];
    const status = validStatuses.includes(data.status) 
      ? data.status as 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled'
      : 'draft';
    
    // Return contract data
    return {
      data: {
        id: data.original_id,
        title: data.title,
        content: content.content || '',
        client_name: data.client_name,
        client_website: data.client_website,
        status: status,
        created_at: data.created_at,
        updated_at: data.updated_at,
        client_signed: content.client_signed || false,
        client_signed_at: content.client_signed_at,
        client_signature: content.client_signature,
        admin_signed: content.admin_signed || false,
        admin_signed_at: content.admin_signed_at,
        admin_signature: content.admin_signature,
        shared_url: data.shared_url
      }
    };
  } catch (error: any) {
    console.error('Error fetching shared contract:', error);
    
    // Log failed access
    await logSharedContentAccess({
      contentType: 'contract',
      contentId: id,
      accessType: 'view',
      options: {
        success: false,
        error_message: error.message
      }
    });
    
    return {
      data: null,
      error: error.message || 'Error fetching shared contract'
    };
  }
};

export const getSharedInvoice = async (id: string): Promise<SharedInvoiceResponse> => {
  try {
    // Log access attempt
    await logSharedContentAccess({
      contentType: 'invoice',
      contentId: id,
      accessType: 'view'
    });

    // Fetch the shared invoice
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('shared_url', id)
      .eq('content_type', 'invoice')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Invoice not found');

    // Check if password protected
    const isPasswordProtected = data.password ? true : false;
    
    // Process content to ensure it's properly typed
    const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content || {};
    
    // Return invoice data
    return {
      data: {
        id: data.original_id,
        title: data.title,
        description: data.description,
        amount: content.amount || 0,
        status: data.status,
        due_date: content.due_date,
        payment_method: content.payment_method,
        payment_date: content.payment_date,
        payment_instructions: content.payment_instructions,
        shared_url: data.shared_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
        client_name: data.client_name,
        client_website: data.client_website
      },
      isPasswordProtected
    };
  } catch (error: any) {
    console.error('Error fetching shared invoice:', error);
    
    // Log failed access
    await logSharedContentAccess({
      contentType: 'invoice',
      contentId: id,
      accessType: 'view',
      options: {
        success: false,
        error_message: error.message
      }
    });
    
    return {
      data: null,
      error: error.message || 'Error fetching shared invoice'
    };
  }
};

export const verifySharedContentPassword = async (
  contentId: string,
  contentType: SharedContentType,
  password: string
): Promise<boolean> => {
  try {
    // Log password attempt
    await logSharedContentAccess({
      contentType,
      contentId,
      accessType: 'password_attempt',
      options: {
        password_attempt: true
      }
    });

    // Check password directly
    const { data, error } = await supabase
      .from('shared_content')
      .select('id')
      .eq('shared_url', contentId)
      .eq('content_type', contentType)
      .eq('password', password)
      .single();
    
    if (error) throw error;
    
    // Log success or failure
    await logSharedContentAccess({
      contentType,
      contentId,
      accessType: 'password_attempt',
      options: {
        success: !!data,
        password_attempt: true
      }
    });
    
    return !!data;
  } catch (error) {
    console.error('Error verifying shared content password:', error);
    
    // Log failure
    await logSharedContentAccess({
      contentType,
      contentId,
      accessType: 'password_attempt',
      options: {
        success: false,
        password_attempt: true,
        error_message: 'Error verifying password'
      }
    });
    
    return false;
  }
};
