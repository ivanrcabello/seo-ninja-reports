
/**
 * Shared content types for public access
 */

// Public Report
export interface PublicReport {
  id: string;
  title: string;
  summary?: string;
  date: string;
  url?: string;
  status: "processing" | "completed" | "failed";
  content?: any;
  client_name?: string;
  client_website?: string;
  shared_url?: string;
  password?: string;
}

// Shared Invoice
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
  shared_url?: string;
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_website?: string;
}

// Shared Contract
export interface SharedContract {
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
  shared_url?: string;
}

// Shared Proposal
export interface SharedProposal {
  id: string;
  title: string;
  description?: string;
  services?: string[];
  price?: number;
  status: string;
  client_name?: string;
  client_website?: string;
  shared_url?: string;
  created_at: string;
  updated_at: string;
}
