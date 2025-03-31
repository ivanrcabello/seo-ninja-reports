
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { SharedContract } from './types';
import { getSharedContract } from '@/services/sharedContentService';

export function useContractData(id?: string) {
  const [contract, setContract] = useState<SharedContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const { data: settings, error } = await supabase
          .from('settings')
          .select('logo_url')
          .eq('id', 1)
          .single();

        if (error) throw error;
        setLogo(settings?.logo_url || null);
      } catch (err) {
        console.error('Error loading logo:', err);
      }
    };

    loadLogo();
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('ID de contrato no proporcionado');
      return;
    }

    const fetchContract = async () => {
      setLoading(true);
      setError(null);

      try {
        const contractResponse = await getSharedContract(id);
        
        if (contractResponse.error) {
          setError(contractResponse.error);
          return;
        }

        if (!contractResponse.data) {
          setError('Contrato no encontrado');
          return;
        }

        setContract(contractResponse.data);
      } catch (err: any) {
        console.error('Error fetching contract:', err);
        setError(err.message || 'Error al cargar el contrato');
        toast.error('Error al cargar el contrato');
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  return { contract, setContract, loading, error, logo };
}
