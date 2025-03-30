
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
    
    try {
      // For RPC calls, we need to use the auth header via fetch
      // We can't use the headers option directly with rpc()
      // Instead of accessing protected properties, we use environment variables or constants
      const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ctidzqynewvqxguhhknp.supabase.co";
      const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0aWR6cXluZXd2cXhndWhoa25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzgzMDksImV4cCI6MjA1Nzk1NDMwOX0.duoo6n4oN7FV--pQrEKWQZlqoslDxr-6dshz83IV2w4";
      
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/${functionName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${token}`,
            'x-client-token': token
          },
          body: JSON.stringify(params)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        clientPortalLogger.error(`Error calling RPC ${functionName}`, errorData, 'ClientPortalApiService');
        throw new Error(errorData.message || 'Error en la llamada RPC');
      }
      
      const data = await response.json();
      return data as T;
    } catch (err) {
      clientPortalLogger.error(`Error calling RPC ${functionName}`, err, 'ClientPortalApiService');
      throw err;
    }
  }

  /**
   * Obtiene los informes del cliente directamente de la tabla
   */
  async getReports(clientId: string): Promise<any[]> {
    this.ensureToken();
    
    try {
      const { data, error } = await supabase
        .from('client_portal_reports')
        .select('id, title, created_at, shared_url')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      clientPortalLogger.error('Error fetching reports', err, 'ClientPortalApiService');
      throw err;
    }
  }

  /**
   * Obtiene las propuestas del cliente directamente de la tabla
   */
  async getProposals(clientId: string): Promise<any[]> {
    this.ensureToken();
    
    try {
      const { data, error } = await supabase
        .from('client_portal_proposals')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      clientPortalLogger.error('Error fetching proposals', err, 'ClientPortalApiService');
      throw err;
    }
  }

  /**
   * Obtiene las facturas del cliente directamente de la tabla
   */
  async getInvoices(clientId: string): Promise<any[]> {
    this.ensureToken();
    
    try {
      const { data, error } = await supabase
        .from('client_portal_invoices')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      clientPortalLogger.error('Error fetching invoices', err, 'ClientPortalApiService');
      throw err;
    }
  }

  /**
   * Obtiene los contratos del cliente directamente de la tabla
   */
  async getContracts(clientId: string): Promise<any[]> {
    this.ensureToken();
    
    try {
      const { data, error } = await supabase
        .from('client_portal_contracts')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      clientPortalLogger.error('Error fetching contracts', err, 'ClientPortalApiService');
      throw err;
    }
  }

  /**
   * Obtiene la información de cuenta del cliente
   */
  async getAccountData(clientId: string, accountId: string): Promise<any> {
    this.ensureToken();
    
    try {
      // Obtener datos de la cuenta del cliente
      const { data: accountData, error: accountError } = await supabase
        .from('client_portal_accounts')
        .select('id, email, last_login')
        .eq('id', accountId)
        .eq('client_id', clientId)
        .single();
      
      if (accountError) throw accountError;
      
      // Obtener datos del cliente
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, name, website, phone_number, industry')
        .eq('id', clientId)
        .single();
      
      if (clientError) throw clientError;
      
      // Combinar datos
      return {
        client: clientData,
        account: accountData
      };
    } catch (err) {
      clientPortalLogger.error('Error fetching account data', err, 'ClientPortalApiService');
      throw err;
    }
  }
}

// Exportamos una instancia única del servicio
export const clientPortalApi = new ClientPortalApiService();
