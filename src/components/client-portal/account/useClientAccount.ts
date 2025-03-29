
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { clientPortalLogger } from '@/services/clientPortalLoggingService';

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
        const sessionString = localStorage.getItem('clientPortalSession');
        
        if (!sessionString) {
          throw new Error('Session token not found. Please log in again.');
        }
        
        const session = JSON.parse(sessionString);
        const clientToken = session.token;
        
        clientPortalLogger.info('Fetching client and account data', { clientId, accountId }, 'useClientAccount');
        
        if (!clientToken) {
          throw new Error('Session token not found. Please log in again.');
        }
        
        // Execute requests to get client data - use client_id parameter instead of Auth
        const clientResponse = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();
          
        // Execute requests to get account data
        const accountResponse = await supabase
          .from('client_portal_accounts')
          .select('*')
          .eq('id', accountId)
          .single();

        if (clientResponse.error) {
          clientPortalLogger.error('Error fetching client data', clientResponse.error, 'useClientAccount');
          throw clientResponse.error;
        }
        
        if (accountResponse.error) {
          clientPortalLogger.error('Error fetching account data', accountResponse.error, 'useClientAccount');
          throw accountResponse.error;
        }
        
        setClient(clientResponse.data);
        setAccount(accountResponse.data);
        
        clientPortalLogger.info('Successfully fetched client and account data', null, 'useClientAccount');
      } catch (err: any) {
        console.error('Error fetching account data:', err);
        clientPortalLogger.error('Error fetching account data', err, 'useClientAccount');
        setError('Error al cargar los datos de la cuenta. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, accountId]);

  return { client, account, loading, error };
}
