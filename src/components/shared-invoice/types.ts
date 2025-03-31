
export interface SharedInvoice {
  id: string;
  title: string;
  description?: string;
  amount: number;
  status: string; // Use string to make it compatible with the shared-content types
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  payment_instructions?: string;
  shared_url?: string;
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_website?: string;
}
