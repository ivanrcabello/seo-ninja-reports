// Tipos de estado compartidos entre todos los tipos de contenido
export type SharedContentStatus = "processing" | "completed" | "failed" | "draft" | "sent" | "accepted" | "rejected" | "pending" | "paid" | "signed" | "expired" | "cancelled";

// Tipos de documentos compartidos
export type SharedDocumentType = "factura" | "contrato" | "presupuesto" | "propuesta" | "informe";

// Tipos de acceso para logs
export type AccessLogType = 'view' | 'print' | 'download' | 'password' | 'not_found' | 'error' | 'check' | 'data_not_found' | 'page_view';

// Opciones comunes para compartir contenido
export interface SharedContentOptions {
  password?: string;
  expiration_date?: string;
  can_download?: boolean;
  notify_on_view?: boolean;
}

// Interfaz base para todo contenido compartido
export interface SharedContentBase {
  id: string;
  title: string;
  shared_url: string;
  created_at: string;
  updated_at: string;
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
  client_signed: boolean;
  client_signed_at?: string;
  client_signature?: string;
  admin_signed: boolean;
  admin_signed_at?: string;
  admin_signature?: string;
}

// Interfaz para documento compartido (tabla central)
export interface SharedDocument {
  id: string;
  client_id: string;
  document_type: SharedDocumentType;
  document_id: string;
  shared_date: string;
  is_active: boolean;
  password?: string;
  expiration_date?: string;
}

// Updated response types with optional error
export interface SharedReportResponse {
  report: SharedReport | null;
  error: Error | null;
}

export interface SharedContractResponse {
  contract: SharedContract | null;
  error: Error | null;
}

export interface SharedInvoiceResponse {
  invoice: SharedInvoice | null;
  error: Error | null;
}

export interface SharedProposalResponse {
  proposal: SharedProposal | null;
  error: Error | null;
}

// Common error response types
export interface ExistsResponse {
  exists: boolean;
  error: Error | null;
}

export interface ProtectionResponse {
  isProtected: boolean;
  error: Error | null;
}

// Interfaz para verificación de contraseña
export interface PasswordVerificationResponse {
  success: boolean;
  message?: string;
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

// Interfaz para actualización de firma de contrato
export interface ContractSignatureUpdate {
  client_signed: boolean;
  client_signed_at: string;
  client_signature: string;
}

// Tipo para los logs de acceso
export interface AccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  source?: string;
  action?: string;
}
