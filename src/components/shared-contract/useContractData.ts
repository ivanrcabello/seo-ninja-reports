
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PublicContract } from './types';
import { toast } from 'sonner';

export const useContractData = (sharedUrlId: string | undefined) => {
  const [contract, setContract] = useState<PublicContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  // Fetch the company logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('logo_url')
          .single();
        
        if (error) {
          console.error('Error fetching logo:', error);
          return;
        }
        
        if (data && data.logo_url) {
          setLogo(data.logo_url);
        }
      } catch (err) {
        console.error('Failed to fetch logo:', err);
      }
    };
    
    fetchLogo();
  }, []);

  // Fetch contract data
  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        
        if (!sharedUrlId) {
          throw new Error('ID de contrato no especificado');
        }
        
        console.log('Fetching contract with shared_url:', sharedUrlId);
        
        // Call the SECURITY DEFINER function with the shared_url parameter
        const { data, error: fetchError } = await supabase
          .rpc('get_public_contract_by_shared_url', {
            shared_url_param: sharedUrlId
          });
        
        if (fetchError) {
          console.error('Error fetching shared contract:', fetchError);
          throw new Error(`Error al cargar contrato: ${fetchError.message}`);
        }
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.error('No contract found with shared_url:', sharedUrlId);
          throw new Error(`Contrato no encontrado`);
        }
        
        console.log('Successfully fetched contract:', data[0]);
        
        // Type the data as PublicContract with proper status validation
        const contractData = data[0];
        const validStatuses: PublicContract['status'][] = ['draft', 'sent', 'signed', 'expired', 'cancelled'];
        const typedContract: PublicContract = {
          ...contractData,
          // Ensure status is one of the valid statuses, defaulting to 'draft' if not
          status: validStatuses.includes(contractData.status as any) 
            ? (contractData.status as PublicContract['status']) 
            : 'draft'
        };
        
        setContract(typedContract);
        
      } catch (err: any) {
        console.error('Error loading shared contract:', err);
        setError(err.message || 'No se pudo cargar el contrato');
        
        toast.error('Error: ' + (err.message || 'No se pudo cargar el contrato'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchContract();
  }, [sharedUrlId]);

  return { contract, setContract, loading, error, logo };
};
