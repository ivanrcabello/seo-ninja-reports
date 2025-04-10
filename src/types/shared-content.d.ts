
// Define type for shared content responses

export interface SharedReportResponse {
  data: {
    id: string;
    title: string;
    summary?: string;
    content?: any;
    date: string;
    client_name?: string;
    client_website?: string;
  } | null;
  error?: string;
  isPasswordProtected?: boolean;
}

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
    client_name?: string;
    client_website?: string;
  } | null;
  error?: string;
  isPasswordProtected?: boolean;
}

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
    client_name?: string;
    client_website?: string;
    invoice_number?: string;
    client_address?: string;
    client_tax_id?: string;
    billing_name?: string;
    billing_tax_id?: string;
    billing_address?: string;
    billing_email?: string;
    billing_phone?: string;
    includes_vat: boolean;
  } | null;
  error?: string;
  isPasswordProtected?: boolean;
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
  error?: string;
  isPasswordProtected?: boolean;
}
