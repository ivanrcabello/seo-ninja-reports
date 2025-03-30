
/**
 * Type definitions for Supabase RPC function responses
 */

export interface RpcResponseCheckReportExists {
  exists: boolean;
}

export interface PublicReportData {
  id: string;
  title: string | null;
  summary: string | null;
  url: string | null;
  status: string | null;
  content: any | null;
  date: string | null;
  client_name: string | null;
  client_website: string | null;
}

export interface RpcResponseGetPublicReportById {
  id: string;
  title: string | null;
  summary: string | null;
  url: string | null;
  status: string | null;
  content: any | null;
  date: string | null;
  client_name: string | null;
  client_website: string | null;
}
