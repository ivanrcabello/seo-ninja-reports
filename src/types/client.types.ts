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
  company_name?: string;
  address?: string;
  tax_id?: string;
  email?: string;
  notes?: string;
}

export interface ClientContract {
  id: string;
  client_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  client_signed: boolean;
  admin_signed: boolean;
  client_signed_at?: string;
  admin_signed_at?: string;
  client_signature?: string;
  admin_signature?: string;
  shared_url?: string;
}

export interface ClientInvoice {
  id: string;
  client_id: string;
  title: string;
  amount: number;
  description?: string;
  status: 'paid' | 'pending' | 'cancelled' | 'overdue';
  created_at: string;
  updated_at: string;
  due_date?: string;
  payment_date?: string;
  shared_url?: string;
  payment_method?: string;
  payment_instructions?: string;
  includes_vat?: boolean;
  invoice_number?: string;
  client_tax_id?: string;
  client_address?: string;
  billing_name?: string;
  billing_tax_id?: string;
  billing_address?: string;
  billing_email?: string;
  password?: string;
  client_website?: string;
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
  password?: string;
}

export interface ClientTask {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  due_date?: string;
  assigned_to?: string;
}

export interface ClientTaskInput {
  title: string;
  description?: string;
  status: ClientTask['status'];
  priority: ClientTask['priority'];
  due_date?: string;
  assigned_to?: string;
}
