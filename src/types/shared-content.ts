
// Tipos de estado compartidos entre todos los tipos de contenido
export type SharedContentStatus = "processing" | "completed" | "failed" | "draft" | "sent" | "accepted" | "rejected" | "pending" | "paid";

// Interfaz base para todo contenido compartido
export interface SharedContentBase {
  id: string;
  title: string;
  shared_url: string;
  created_at: string;
  updated_at?: string;
  client_name?: string;
  client_website?: string;
}

// Public Report type (for compatibility with existing code)
export type PublicReport = SharedReport;

// Informe público compartido
export interface SharedReport extends SharedContentBase {
  summary?: string;
  url?: string;
  status: SharedContentStatus;
  content?: any;
  date?: string;
}

// Propuesta pública compartida
export interface SharedProposal extends SharedContentBase {
  description?: string;
  services?: string[];
  price?: number;
  status: SharedContentStatus;
}

// Factura pública compartida
export interface SharedInvoice extends SharedContentBase {
  description?: string;
  amount: number;
  status: SharedContentStatus;
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  payment_instructions?: string;
}

// Contrato público compartido
export interface SharedContract extends SharedContentBase {
  content: string;
  status: SharedContentStatus;
  client_signed?: boolean;
  client_signed_at?: string;
  client_signature?: string;
  admin_signed?: boolean;
  admin_signed_at?: string;
  admin_signature?: string;
}

// Interfaz para la respuesta de verificación de contraseña
export interface PasswordVerificationResponse {
  success: boolean;
  message?: string;
}

// Opciones comunes para compartir contenido
export interface SharedContentOptions {
  password?: string;
  expiration_date?: string;
  can_download?: boolean;
  notify_on_view?: boolean;
}

// Interfaz para estadísticas de visualización
export interface SharedContentStats {
  views: number;
  unique_views: number;
  last_viewed_at?: string;
  viewer_locations?: {
    country: string;
    count: number;
  }[];
}
