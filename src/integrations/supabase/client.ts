
import { createClient } from '@supabase/supabase-js';
import { Json } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      public_reports: {
        Row: {
          id: string;
          title: string;
          content: Json;
          client_name: string;
          created_at: string;
          updated_at: string;
          password_protected: boolean;
          password?: string;
          website?: string;
          executive_summary?: string;
        };
        Insert: {
          id: string;
          title: string;
          content: Json;
          client_name: string;
          created_at?: string;
          updated_at?: string;
          password_protected: boolean;
          password?: string;
          website?: string;
          executive_summary?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: Json;
          client_name?: string;
          created_at?: string;
          updated_at?: string;
          password_protected?: boolean;
          password?: string;
          website?: string;
          executive_summary?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      verify_report_password: {
        Args: {
          report_id: string;
          password_to_check: string;
        };
        Returns: boolean;
      };
    };
  };
}
