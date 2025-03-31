
// Tipos de estado compartidos entre todos los tipos de contenido
export type SharedContentStatus = "processing" | "completed" | "failed" | "draft" | "sent" | "accepted" | "rejected" | "pending" | "paid" | "signed" | "expired" | "cancelled";

// Tipos de documentos compartidos
export type SharedContentType = "report" | "proposal" | "invoice" | "contract";

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
  original_id: string;
  content_type: SharedContentType;
  title: string;
  description?: string;
  content?: any;
  status: SharedContentStatus;
  shared_url: string;
  password?: string;
  client_name?: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}

// Informe compartido
export interface SharedReport extends SharedContentBase {
  content_type: 'report';
  summary?: string;
  url?: string;
}

// Propuesta compartida
export interface SharedProposal extends SharedContentBase {
  content_type: 'proposal';
  services?: string[];
  price?: number;
}

// Factura compartida
export interface SharedInvoice extends SharedContentBase {
  content_type: 'invoice';
  amount: number;
  due_date?: string;
  payment_method?: string;
  payment_date?: string;
  payment_instructions?: string;
}

// Contrato compartido
export interface SharedContract extends SharedContentBase {
  content_type: 'contract';
  client_signed?: boolean;
  client_signed_at?: string;
  client_signature?: string;
  admin_signed?: boolean;
  admin_signed_at?: string;
  admin_signature?: string;
}

// Respuestas de API
export interface SharedContentResponse<T extends SharedContentBase> {
  data: T | null;
  error: Error | null;
}

export type SharedReportResponse = SharedContentResponse<SharedReport>;
export type SharedProposalResponse = SharedContentResponse<SharedProposal>;
export type SharedInvoiceResponse = SharedContentResponse<SharedInvoice>;
export type SharedContractResponse = SharedContentResponse<SharedContract>;

// Interfaces comunes
export interface ExistsResponse {
  exists: boolean;
  error: Error | null;
}

export interface ProtectionResponse {
  isProtected: boolean;
  error: Error | null;
}

// Interfaz para opciones de log de acceso
export interface AccessLogOptions {
  successful: boolean;
  passwordAttempt?: boolean;
  error?: string;
  source?: string;
  action?: string;
}

// Interfaz para actualización de firma de contrato
export interface ContractSignatureUpdate {
  client_signed: boolean;
  client_signed_at: string;
  client_signature: string;
  status?: SharedContentStatus;
}
