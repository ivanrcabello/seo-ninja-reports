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

export interface ClientNote {
  id: string;
  client_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}
