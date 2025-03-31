
// Types for shared content (reports, invoices, contracts, etc.)

// Basic shared report type
export interface PublicReport {
  id: string;
  title: string;
  summary?: string;
  url?: string;
  status: "processing" | "completed" | "failed";
  content?: any;
  date?: string;
  client_name?: string;
  client_website?: string;
  shared_url?: string;
}

// Extended shared contract type
export interface SharedContract {
  id: string;
  title: string;
  content: string;
  status: string;
  client_name?: string;
  client_website?: string;
  client_signed: boolean;
  client_signed_at?: string;
  client_signature?: string;
  admin_signed: boolean;
  admin_signed_at?: string;
  admin_signature?: string;
  created_at: string;
  updated_at: string;
  shared_url?: string;
}

// Shared invoice type
export interface SharedInvoice {
  id: string;
  title: string;
  description?: string;
  amount: number;
  status: string;
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  payment_instructions?: string;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
  shared_url?: string;
}

// Shared proposal type
export interface SharedProposal {
  id: string;
  title: string;
  description?: string;
  services?: string[];
  price?: number;
  status: string;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
  shared_url?: string;
}
