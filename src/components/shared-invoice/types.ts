
export interface SharedInvoice {
  id: string;
  title: string;
  description?: string;
  amount: number;
  status: string;
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  payment_instructions?: string;
  shared_url: string;
  created_at: string;
  updated_at?: string;
  client_name: string;
  client_website?: string;
  client_tax_id?: string;
  client_address?: string;
  invoice_number?: string;
  billing_name?: string;
  billing_tax_id?: string;
  billing_address?: string;
  billing_email?: string;
  billing_phone?: string;
  includes_vat?: boolean;
}
