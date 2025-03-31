
export interface PublicContract {
  id: string;
  title: string;
  content: string;
  client_name?: string;
  client_website?: string;
  status: string; // Changed to string for compatibility
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
