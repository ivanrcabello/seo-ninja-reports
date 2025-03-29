
import { supabase } from '@/integrations/supabase/client';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';

/**
 * Clase de servicio para realizar llamadas a la API del portal de clientes
 * con el token de autenticación incluido automáticamente
 */
class ClientPortalApiService {
  private clientToken: string | null = null;

  constructor() {
    this.loadToken();
  }

  /**
   * Carga el token del cliente desde localStorage
   */
  private loadToken(): void {
    try {
      const sessionString = localStorage.getItem('clientPortalSession');
      if (sessionString) {
        const session = JSON.parse(sessionString);
        this.clientToken = session.token;
      }
    } catch (error) {
      console.error('Error loading client token:', error);
      this.clientToken = null;
    }
  }

  /**
   * Verifica si hay un token válido y lo vuelve a cargar si es necesario
   */
  private ensureToken(): string {
    if (!this.clientToken) {
      this.loadToken();
    }
    
    if (!this.clientToken) {
      throw new Error('No active session found. Please log in again.');
    }
    
    return this.clientToken;
  }

  /**
   * Realiza una llamada RPC con el token del cliente
   */
  async callRpc<T>(
    functionName: string, 
    params: Record<string, any> = {}
  ): Promise<T> {
    const token = this.ensureToken();
    
    clientPortalLogger.info(`Calling RPC ${functionName}`, params, 'ClientPortalApiService');
    
    // Configuramos headers según documentación de Supabase para RPC
    // La sintaxis correcta es pasar un objeto con options.headers
    const { data, error } = await supabase.rpc(
      functionName as any,
      params,
      {
        // Los headers se pasan como parte de las opciones globales, no dentro de un objeto 'headers'
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-client-token': token
        }
      }
    );
    
    if (error) {
      clientPortalLogger.error(`Error calling RPC ${functionName}`, error, 'ClientPortalApiService');
      throw error;
    }
    
    return data as T;
  }

  /**
   * Obtiene los informes del cliente
   */
  async getReports(clientId: string): Promise<any[]> {
    return this.callRpc<any[]>('get_client_portal_reports', { client_id_param: clientId });
  }

  /**
   * Obtiene las propuestas del cliente
   */
  async getProposals(clientId: string): Promise<any[]> {
    return this.callRpc<any[]>('get_client_portal_proposals', { client_id_param: clientId });
  }

  /**
   * Obtiene las facturas del cliente
   */
  async getInvoices(clientId: string): Promise<any[]> {
    return this.callRpc<any[]>('get_client_portal_invoices', { client_id_param: clientId });
  }

  /**
   * Obtiene los contratos del cliente
   */
  async getContracts(clientId: string): Promise<any[]> {
    return this.callRpc<any[]>('get_client_portal_contracts', { client_id_param: clientId });
  }

  /**
   * Obtiene la información de cuenta del cliente
   */
  async getAccountData(clientId: string, accountId: string): Promise<any[]> {
    return this.callRpc<any[]>('get_client_portal_account_data', { 
      client_id_param: clientId,
      account_id_param: accountId
    });
  }
}

// Exportamos una instancia única del servicio
export const clientPortalApi = new ClientPortalApiService();
