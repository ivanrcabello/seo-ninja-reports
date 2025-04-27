
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
  company_name?: string; // New field
  address?: string; // New field
  tax_id?: string; // New field
  email?: string; // New field
  notes?: string; // New field
}
