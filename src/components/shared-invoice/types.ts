
export interface SharedInvoice {
  id: string;
  invoice_number?: string;
  title: string;
  description?: string;
  amount: number;
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
  client_address?: string;
  client_tax_id?: string;
  billing_name?: string;
  billing_address?: string;
  billing_tax_id?: string;
  billing_email?: string;
  includes_vat?: boolean;
}
