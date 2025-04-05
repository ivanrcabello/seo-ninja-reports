
// Types for shared content (reports, proposals, contracts, invoices)

// Shared content types
export type SharedContentType = 'report' | 'proposal' | 'contract' | 'invoice';

// Access log types
export type AccessLogType = 'view' | 'password_attempt' | 'sign';
export interface AccessLogOptions {
  source?: string;
  password_attempt?: boolean;
  error_message?: string;
  success?: boolean;
}

// Generic responses
export interface ExistsResponse {
  exists: boolean;
}

export interface ProtectionResponse {
  isPasswordProtected: boolean;
}

// Report types
export interface SharedReportResponse {
  data: {
    id: string;
    title: string;
    summary?: string;
    url?: string;
    content?: any;
    date: string;
    client_name?: string;
    client_website?: string;
  } | null;
  isPasswordProtected?: boolean;
  error?: string;
}

// Proposal types
export interface SharedProposalResponse {
  data: {
    id: string;
    title: string;
    description?: string;
    status: string;
    price?: number;
    services?: string[];
    shared_url: string;
    created_at: string;
    updated_at: string;
    client_name: string;
    client_website?: string;
  } | null;
  isPasswordProtected?: boolean;
  error?: string;
}

// Contract types
export interface ContractSignatureUpdate {
  client_signed: boolean;
  client_signed_at: string;
  client_signature: string;
  status?: string;
}

export interface SharedContractResponse {
  data: {
    id: string;
    title: string;
    content: string;
    client_name?: string;
    client_website?: string;
    status: string;
    created_at: string;
    updated_at: string;
    client_signed: boolean;
    client_signed_at?: string;
    client_signature?: string;
    admin_signed: boolean;
    admin_signed_at?: string;
    admin_signature?: string;
    shared_url: string;
  } | null;
  isPasswordProtected?: boolean;
  error?: string;
}

// Invoice types
export interface SharedInvoiceResponse {
  data: {
    id: string;
    title: string;
    description?: string;
    amount: number;
    status: string;
    due_date?: string;
    payment_method?: string;
    payment_date?: string;
    payment_instructions?: string;
    shared_url: string;
    created_at: string;
    updated_at: string;
    client_name: string;
    client_website?: string;
    client_address?: string;
    client_tax_id?: string;
    billing_name?: string;
    billing_tax_id?: string;
    billing_address?: string;
    billing_email?: string;
    includes_vat?: boolean;
    invoice_number?: string;
  } | null;
  isPasswordProtected?: boolean;
  error?: string;
}
