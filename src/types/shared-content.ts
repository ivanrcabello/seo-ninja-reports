
export type SharedContentStatus = 
  "processing" | "completed" | "failed" | "draft" | "sent" |
  "accepted" | "rejected" | "pending" | "paid" | "signed" |
  "expired" | "cancelled";

export interface SharedReport {
  id: string;
  original_id: string;
  content_type: string;
  title: string;
  description?: string;
  summary?: string;
  content?: any;
  status: SharedContentStatus;
  shared_url: string;
  password?: string;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}

export interface SharedContract {
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

export interface SharedProposal {
  id: string;
  original_id: string;
  content_type: string;
  title: string;
  description?: string;
  price?: number;
  services?: string[];
  content?: any;
  status: SharedContentStatus;
  shared_url: string;
  password?: string;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}

export interface SharedInvoice {
  id: string;
  original_id: string;
  content_type: string;
  title: string;
  description?: string;
  amount?: number;
  due_date?: string;
  payment_method?: string;
  payment_instructions?: string;
  status: SharedContentStatus;
  shared_url: string;
  password?: string;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}
