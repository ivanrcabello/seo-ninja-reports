
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

interface ClientPortalAccountData {
  client_id: string;
  client_name: string;
  client_website: string;
  client_phone_number: string | null;
  client_industry: string | null;
  account_id: string;
  account_email: string;
  account_last_login: string | null;
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
        console.log('Fetching with token:', clientToken);
        
        if (!clientToken) {
          throw new Error('Session token not found. Please log in again.');
        }
        
        // Use the RPC function with the token in the headers
        const { data, error } = await supabase
          .rpc('get_client_portal_account_data', {
            client_id_param: clientId,
            account_id_param: accountId
          })
          .returns<ClientPortalAccountData>()
          .abortSignal(new AbortController().signal)
          .withHeaders({
            'x-client-token': clientToken
          })
          .maybeSingle();
          
        if (error) {
          clientPortalLogger.error('Error fetching account data', error, 'useClientAccount');
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (!data) {
          console.error('No data returned from get_client_portal_account_data');
          throw new Error('No data found for this account.');
        }
        
        console.log('Account data retrieved:', data);
        
        // Transform the data to match our interface
        const accountData = data as ClientPortalAccountData;
        
        const clientData: Client = {
          id: accountData.client_id,
          name: accountData.client_name,
          website: accountData.client_website,
          phone_number: accountData.client_phone_number || undefined,
          industry: accountData.client_industry || undefined
        };
        
        const accountInfo: ClientAccount = {
          id: accountData.account_id,
          email: accountData.account_email,
          client_id: accountData.client_id,
          last_login: accountData.account_last_login || undefined
        };
        
        setClient(clientData);
        setAccount(accountInfo);
        
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
