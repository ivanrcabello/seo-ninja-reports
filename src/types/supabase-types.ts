
// Este archivo contiene tipos adicionales que se integran con los tipos generados por Supabase
// No eliminar este archivo, es complementario a los tipos generados automáticamente

export interface SharedContentRow {
  id: string;
  original_id: string;
  content_type: string;
  title: string;
  description?: string;
  content?: any;
  status: string;
  shared_url: string;
  password?: string;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}
