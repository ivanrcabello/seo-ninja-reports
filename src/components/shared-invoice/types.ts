
export interface SharedInvoice {
  id: string;
  title: string;
  description?: string;
  amount: number;
  subtotal?: number;
  vat_rate?: number;
  vat_amount?: number;
  invoice_number?: string;
  invoice_year?: number;
  status: 'pending' | 'paid' | 'cancelled' | 'overdue';
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  payment_instructions?: string;
  shared_url: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_website?: string;
}

export interface FiscalSettings {
  id: number;
  company_name: string;
  tax_id: string;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  vat_rate?: number; // Add vat_rate property
  created_at: string;
  updated_at: string;
}

// Extend the Database type to include our new functions
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T>(
      fn: 'get_vat_rate_wrapper' | 'update_vat_rate_wrapper' | string,
      params?: object
    ): { data: T | null; error: Error | null };
  }
}
