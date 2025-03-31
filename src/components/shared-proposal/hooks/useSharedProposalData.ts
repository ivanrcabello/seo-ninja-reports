
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AccessLogOptions, AccessLogType, SharedProposalResponse } from '@/types/shared-content';
import { logAccess } from '@/api/shared-content/utils';

export function useSharedProposalData(sharedUrl: string) {
  const [proposal, setProposal] = useState<SharedProposalResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposal = async () => {
      if (!sharedUrl) return;
      
      try {
        setLoading(true);
        
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
        
        setProposal(data as SharedProposalResponse);
        
        // Log this access
        try {
          const options: AccessLogOptions = {
            userAgent: navigator.userAgent,
            referrer: document.referrer
          };
          
          await logAccess('proposal', sharedUrl, 'view' as AccessLogType, options);
        } catch (logError) {
          console.error('Error logging access:', logError);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching proposal:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposal();
  }, [sharedUrl]);

  return { proposal, loading, error };
}

export default useSharedProposalData;
