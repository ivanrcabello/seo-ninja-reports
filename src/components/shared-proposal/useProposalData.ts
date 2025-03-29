
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import sharedContentLogger from '@/utils/sharedContentLogger';

export interface SharedProposal {
  id: string;
  title: string;
  description?: string;
  status: string;
  price?: number;
  services?: string[];
  shared_url: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_website?: string;
}

const useProposalData = (sharedUrl: string) => {
  const [proposal, setProposal] = useState<SharedProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const verifyPassword = async (password: string) => {
    try {
      sharedContentLogger.info(`Verifying password for proposal with shared URL: ${sharedUrl}`);
      
      // Call function to verify password
      const { data, error: verifyError } = await supabase.rpc(
        'verify_shared_proposal_password', 
        { 
          shared_url_param: sharedUrl || '',
          password_param: password
        }
      );
      
      if (verifyError) throw new Error(verifyError.message);
      
      if (data === true) {
        setAccessGranted(true);
        sharedContentLogger.success(`Password verification successful for proposal: ${sharedUrl}`);
        return true;
      } else {
        sharedContentLogger.warning(`Incorrect password for proposal: ${sharedUrl}`);
        return false;
      }
    } catch (err: any) {
      sharedContentLogger.error(`Error verifying password`, err);
      return false;
    }
  };

  const fetchProposal = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL no válida');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    sharedContentLogger.group(`Fetching proposal: ${sharedUrl}`);
    sharedContentLogger.timeStart('fetch-proposal');

    try {
      // Check if proposal is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_proposal_password_protection', 
        { shared_url_param: sharedUrl }
      );
      
      if (protectionError) {
        sharedContentLogger.error("Protection check error", protectionError);
        throw new Error(protectionError.message);
      }
      
      setIsPasswordProtected(protectionData === true);
      sharedContentLogger.info(`Proposal password protected: ${protectionData}`);
      
      // If password protected and access not granted yet, return early
      if (protectionData === true && !accessGranted) {
        sharedContentLogger.info(`Password protection active and access not granted yet`);
        setIsLoading(false);
        sharedContentLogger.timeEnd('fetch-proposal');
        sharedContentLogger.groupEnd();
        return;
      }
      
      // Fetch from public_proposals directly (no RLS, no authentication required)
      const { data, error } = await supabase
        .from('public_proposals')
        .select('*')
        .eq('shared_url', sharedUrl)
        .maybeSingle();

      if (error) {
        sharedContentLogger.error("Database fetch error", error);
        throw new Error(error.message);
      }

      if (!data) {
        sharedContentLogger.error("No proposal data found");
        throw new Error('Propuesta no encontrada');
      } 

      sharedContentLogger.group('Raw proposal data', true);
      sharedContentLogger.table(data);
      sharedContentLogger.groupEnd();
      
      // Format the data with safe type handling
      const formattedProposal: SharedProposal = {
        id: data.id || '',
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'draft',
        price: data.price || undefined,
        services: Array.isArray(data.services) ? data.services : [],
        shared_url: data.shared_url || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        client_name: data.client_name || '',
        client_website: data.client_website
      };
      
      sharedContentLogger.success(`Proposal data formatted successfully`);
      setProposal(formattedProposal);
    } catch (err: any) {
      sharedContentLogger.error('Error fetching shared proposal', err);
      setError(err.message || 'Error al cargar la propuesta');
    } finally {
      setIsLoading(false);
      sharedContentLogger.timeEnd('fetch-proposal');
      sharedContentLogger.groupEnd();
    }
  }, [sharedUrl, accessGranted]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return {
    proposal,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    setAccessGranted,
    verifyPassword,
    refetch: fetchProposal
  };
};

export default useProposalData;
