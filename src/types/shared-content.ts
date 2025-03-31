
export type SharedContentStatus = 
  "processing" | "completed" | "failed" | "draft" | "sent" |
  "accepted" | "rejected" | "pending" | "paid" | "signed" |
  "expired" | "cancelled";

export type SharedContentType = "report" | "contract" | "proposal" | "invoice";

export type AccessLogType = 'view' | 'page_view' | 'password' | 'download' | 'print' | 'not_found' | 'error' | 'sign';

export interface AccessLogOptions {
  successful: boolean;
  error?: string;
  action?: string;
  passwordAttempt?: boolean;
  source?: string;
}

export interface ExistsResponse {
  exists: boolean;
  error: Error | null;
}

export interface ProtectionResponse {
  isProtected: boolean;
  error: Error | null;
}

// Basic shared content interface
interface SharedContent {
  id: string;
  original_id: string;
  content_type: string;
  title: string;
  description?: string;
  content?: any;
  status: SharedContentStatus;
  shared_url: string;
  password?: string;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}

// Report specific interface
export interface SharedReport extends SharedContent {
  summary?: string;
}

export interface SharedReportResponse {
  data: SharedReport | null;
  error: Error | null;
}

// Contract specific interface
export interface SharedContract extends SharedContent {
  client_signed?: boolean;
  client_signed_at?: string;
  client_signature?: string;
  admin_signed?: boolean;
  admin_signed_at?: string;
  admin_signature?: string;
}

export interface SharedContractResponse {
  data: SharedContract | null;
  error: Error | null;
}

export interface ContractSignatureUpdate {
  client_signed?: boolean;
  client_signed_at?: string;
  client_signature?: string;
  status?: SharedContentStatus;
}

// Proposal specific interface
export interface SharedProposal extends SharedContent {
  price?: number;
  services?: string[];
}

export interface SharedProposalResponse {
  data: SharedProposal | null;
  error: Error | null;
}

// Invoice specific interface
export interface SharedInvoice extends SharedContent {
  amount?: number;
  due_date?: string;
  payment_method?: string;
  payment_instructions?: string;
}

export interface SharedInvoiceResponse {
  data: SharedInvoice | null;
  error: Error | null;
}
