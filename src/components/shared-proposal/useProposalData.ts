
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SharedProposalResponse } from '@/types/shared-content';
import { logSharedContentAccess, verifyContentPassword } from '@/api/shared-content/utils';
import { getSharedProposal } from '@/services/sharedContentService';

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
      
      // Use modified service to get protected proposal status
      const response = await getSharedProposal(sharedUrl);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setIsPasswordProtected(!!response.isPasswordProtected);
      
      if (response.isPasswordProtected) {
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
      
      if (!response.data) {
        throw new Error('Propuesta no encontrada');
      }
      
      setProposal(response.data);
      
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
        contentId: sharedUrl || '',
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
      if (!sharedUrl) return false;
      
      const verified = await verifyContentPassword(sharedUrl, 'proposal', password);
      
      // Log password attempt
      await logSharedContentAccess({
        contentType: 'proposal',
        contentId: sharedUrl,
        accessType: 'view',
        options: {
          password_attempt: true,
          success: verified
        }
      });
      
      if (verified) {
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
