
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SharedProposalResponse, AccessLogOptions, AccessLogType } from '@/types/shared-content';
import { logSharedContentAccess } from '@/api/shared-content/utils';

interface UseProposalDataReturn {
  proposal: any;
  isLoading: boolean;
  error: string | null;
  isPasswordProtected: boolean;
  checkPassword: (password: string) => Promise<boolean>;
}

const useProposalData = (sharedUrl: string | undefined): UseProposalDataReturn => {
  const [proposal, setProposal] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);

  const fetchProposal = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL no válida');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if proposal is password protected
      const { data: protectionData, error: protectionError } = await supabase.rpc(
        'check_proposal_password_protection',
        { shared_url_param: sharedUrl }
      );
      
      if (protectionError) throw new Error(protectionError.message);
      
      setIsPasswordProtected(protectionData === true);
      
      if (protectionData === true) {
        // Log access attempt for password protected content
        await logSharedContentAccess({
          contentType: 'proposal',
          contentId: sharedUrl,
          accessType: 'view',
          options: {
            success: false,
            password_attempt: false,
            error_message: 'Password required'
          }
        });
        
        // Don't fetch the data yet if password protected
        setIsLoading(false);
        return;
      }
      
      // Fetch proposal data
      const { data, error: fetchError } = await supabase
        .from('public_proposals')
        .select('*')
        .eq('shared_url', sharedUrl)
        .single();
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (!data) {
        throw new Error('Propuesta no encontrada');
      }
      
      setProposal(data);
      
      // Log successful access
      await logSharedContentAccess({
        contentType: 'proposal',
        contentId: sharedUrl,
        accessType: 'view',
        options: { success: true }
      });
      
    } catch (err: any) {
      console.error('Error fetching proposal:', err);
      setError(err.message || 'No se pudo cargar la propuesta');
      
      // Log failed access
      await logSharedContentAccess({
        contentType: 'proposal',
        contentId: sharedUrl,
        accessType: 'view',
        options: {
          success: false,
          error_message: err.message || 'No se pudo cargar la propuesta'
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl]);
  
  const checkPassword = async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc(
        'verify_shared_proposal_password',
        {
          shared_url_param: sharedUrl || '',
          password_param: password
        }
      );
      
      if (error) throw new Error(error.message);
      
      // Log password attempt
      await logSharedContentAccess({
        contentType: 'proposal',
        contentId: sharedUrl || '',
        accessType: 'view',
        options: {
          password_attempt: true,
          success: data === true
        }
      });
      
      if (data === true) {
        // If password is correct, fetch the data
        await fetchProposal();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error checking password:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return {
    proposal,
    isLoading,
    error,
    isPasswordProtected,
    checkPassword
  };
};

export default useProposalData;
