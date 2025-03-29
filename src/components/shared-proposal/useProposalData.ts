
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import sharedContentLogger from '@/utils/sharedContentLogger';

export interface SharedProposal {
  id: string;
  title: string;
  description?: string;
  services?: string[];
  status: string;
  price?: number;
  client_name: string;
  client_website?: string;
  created_at: string;
  updated_at: string;
}

export const useProposalData = (sharedUrl: string) => {
  const [proposal, setProposal] = useState<SharedProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const fetchProposal = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL de propuesta no válida');
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
      
      if (protectionError) {
        sharedContentLogger.error("Error checking protection:", protectionError);
        throw new Error(protectionError.message);
      }
      
      setIsPasswordProtected(protectionData === true);
      
      // If password protected and access not granted yet, don't fetch the content
      if (protectionData === true && !accessGranted) {
        setIsLoading(false);
        return;
      }
      
      // Fetch from public_proposals
      const { data, error: fetchError } = await supabase
        .from('public_proposals')
        .select('*')
        .eq('shared_url', sharedUrl)
        .maybeSingle();
      
      if (fetchError) {
        sharedContentLogger.error("Error fetching proposal:", fetchError);
        throw new Error(fetchError.message);
      }
      
      if (!data) {
        sharedContentLogger.error("No proposal data found");
        throw new Error('Propuesta no encontrada');
      }
      
      sharedContentLogger.log("Raw proposal data:", data);
      setProposal(data as SharedProposal);
      
    } catch (err: any) {
      sharedContentLogger.error("Error in fetchProposal:", err);
      setError(err.message || 'No se pudo cargar la propuesta');
      
      toast.error('Error', { 
        description: err.message || 'No se pudo cargar la propuesta'
      });
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl, accessGranted]);
  
  const verifyPassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      sharedContentLogger.log("Verifying password for shared URL:", sharedUrl);
      
      const { data, error } = await supabase.rpc(
        'verify_shared_proposal_password', 
        { 
          shared_url_param: sharedUrl,
          password_param: password
        }
      );
      
      if (error) throw error;
      
      return data === true;
    } catch (err: any) {
      sharedContentLogger.error("Error verifying password:", err);
      return false;
    }
  }, [sharedUrl]);
  
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
