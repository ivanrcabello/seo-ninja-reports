
import { SupabaseClient } from '@supabase/supabase-js';

// Extender la definición del cliente de Supabase para incluir las funciones RPC personalizadas
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(
      fn: string, 
      params?: object,
      options?: {
        head?: boolean;
        count?: null | 'exact' | 'planned' | 'estimated';
      }
    ): any;
  }
}
