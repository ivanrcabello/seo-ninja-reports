export interface Client {
  id: string;
  name: string;
  website: string;
  industry?: string;
  phone_number?: string;
  hosting_credentials?: {
    provider?: string;
    username?: string;
    password?: string;
    url?: string;
  };
  wp_credentials?: {
    username?: string;
    password?: string;
    admin_url?: string;
    url?: string;
  };
  created_at: string;
  updated_at: string;
  user_id: string;
  active: boolean;
  address?: string;
  tax_id?: string;
}

export interface ClientProposal {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  services?: string[];
  price?: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  shared_url?: string;
}

export interface ClientContract {
  id: string;
  client_id: string;
  title: string;
  content: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  created_at: string;
  updated_at: string;
  shared_url?: string;
  client_signed: boolean;
  client_signed_at?: string;
  client_signature?: string;
  admin_signed: boolean;
  admin_signed_at?: string;
  admin_signature?: string;
}

export interface ClientInvoice {
  id: string;
  client_id: string;
  invoice_number?: string;
  title: string;
  description?: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'overdue';
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  payment_instructions?: string;
  shared_url?: string;
  created_at: string;
  updated_at: string;
  client_tax_id?: string;
  client_address?: string;
  billing_name?: string;
  billing_tax_id?: string;
  billing_address?: string;
  billing_email?: string;
  includes_vat?: boolean;
  client_website?: string;
}

export interface ClientNote {
  id: string;
  client_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ClientTask {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientTaskInput {
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: string;
}
