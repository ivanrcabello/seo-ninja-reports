
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

export interface ClientNote {
  id: string;
  client_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
