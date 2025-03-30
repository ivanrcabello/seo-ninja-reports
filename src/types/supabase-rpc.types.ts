
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

export interface RpcResponseGetPublicReportById extends PublicReportData {
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

// Define the expected types for the RPC functions
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(
      fn: 'check_report_exists' | 'get_public_report_by_id' | string,
      params?: object,
      options?: object
    ): Promise<{
      data: T;
      error: Error | null;
    }>;
  }
}
