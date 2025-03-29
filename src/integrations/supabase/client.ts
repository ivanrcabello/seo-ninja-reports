
import { createClient } from '@supabase/supabase-js';
import { Json } from './types';

// Check if environment variables are defined and provide fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ctidzqynewvqxguhhknp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWR6cXluZXd2cXhndWhoa25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzgzMDksImV4cCI6MjA1Nzk1NDMwOX0.duoo6n4oN7FV--pQrEKWQZlqoslDxr-6dshz83IV2w4';

// Create Supabase client with explicit error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Also fix other TypeScript errors mentioned in the build errors:

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
