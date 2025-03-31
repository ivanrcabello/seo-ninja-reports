
import { SharedContentStatus } from '@/types/shared-content';

export interface PublicContract {
  id: string;
  title: string;
  content: string;
  status: SharedContentStatus;
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
  shared_url: string;  // Changed from optional to required
}
