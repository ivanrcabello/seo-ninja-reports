
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  name: string;
  website: string;
  phone_number?: string;
  industry?: string;
}

interface ClientAccount {
  id: string;
  email: string;
  client_id: string;
  last_login?: string;
}

export function useClientAccount(clientId: string, accountId: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [account, setAccount] = useState<ClientAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get client token from localStorage
        const clientToken = localStorage.getItem('clientPortalSession') 
          ? JSON.parse(localStorage.getItem('clientPortalSession')!).token 
          : null;
          
        if (!clientToken) {
          throw new Error('Session token not found. Please log in again.');
        }
        
        // Execute requests with authentication in request headers
        const [clientResponse, accountResponse] = await Promise.all([
          supabase.from('clients').select('*').eq('id', clientId).single(),
          supabase.from('client_portal_accounts').select('*').eq('id', accountId).single()
        ]);

        if (clientResponse.error) throw clientResponse.error;
        if (accountResponse.error) throw accountResponse.error;
        
        setClient(clientResponse.data);
        setAccount(accountResponse.data);
      } catch (err: any) {
        console.error('Error fetching account data:', err);
        setError('Error al cargar los datos de la cuenta. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, accountId]);

  return { client, account, loading, error };
}
