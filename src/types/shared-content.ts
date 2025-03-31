
import { Json } from "@/integrations/supabase/types";

export type SharedContentType = "report" | "invoice" | "proposal" | "contract";

export type AccessLogType = "view" | "download" | "print" | "email" | "sign" | "verify";

export interface AccessLogOptions {
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  location?: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface ExistsResponse {
  exists: boolean;
}

export interface ProtectionResponse {
  protected: boolean;
}

export interface SharedReportResponse {
  id: string;
  title: string;
  date: string;
  status: string;
  url?: string;
  summary?: string;
  content: any;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}

export interface SharedInvoiceResponse {
  id: string;
  title: string;
  description?: string;
  amount: number;
  status: string;
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  payment_instructions?: string;
  content?: any;
  client_name: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}

export interface SharedProposalResponse {
  id: string;
  title: string;
  description?: string;
  status: string;
  price?: number;
  services?: string[];
  client_name: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}

export interface SharedContract {
  id: string;
  title: string;
  content: any;
  status: string;
  start_date?: string;
  end_date?: string;
  client_name: string;
  client_website?: string;
  client_signed?: boolean;
  client_signature?: string;
  client_signed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContractSignatureUpdate {
  signed: boolean;
  signature?: string;
  signed_at?: string;
}
