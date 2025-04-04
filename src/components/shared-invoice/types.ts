
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
  created_at: string;
  updated_at: string;
}
