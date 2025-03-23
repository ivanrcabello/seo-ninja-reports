
export interface SharedInvoice {
  id: string;
  title: string;
  description?: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'overdue';
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  shared_url: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_website?: string;
}
