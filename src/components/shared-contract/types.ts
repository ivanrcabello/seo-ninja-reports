
import { SharedContentStatus, SharedContract } from '@/types/shared-content';

// Type alias for SharedContract to maintain compatibility with PublicContract
export type PublicContract = {
  id: string;
  title: string;
  content: string;
  client_name?: string;
  client_website?: string;
  status: SharedContentStatus;
  created_at: string;
  updated_at: string;
  client_signed: boolean;
  client_signed_at?: string;
  client_signature?: string;
  admin_signed: boolean;
  admin_signed_at?: string;
  admin_signature?: string;
  shared_url: string;
  content_type?: string;
  original_id?: string;
};
