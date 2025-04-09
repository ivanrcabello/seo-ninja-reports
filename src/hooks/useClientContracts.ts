import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ClientContract } from '@/types/client.types';
import { toast } from 'sonner';

export interface CreateContractData {
  title: string;
  content: string;
  status?: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
}

export interface UpdateContractData {
  title?: string;
  content?: string;
  status?: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  client_signed?: boolean;
  client_signed_at?: string;
  client_signature?: string;
  admin_signed?: boolean;
  admin_signed_at?: string;
  admin_signature?: string;
}

export const useClientContracts = (clientId?: string) => {
  const [contracts, setContracts] = useState<ClientContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!clientId) {
        console.warn('No clientId provided to useClientContracts');
        setContracts([]);
        return;
      }
      
      console.log('Fetching contracts for client:', clientId);
      
      const query = supabase.from('client_contracts').select('*');
      query.eq('client_id', clientId);
      query.order('created_at', { ascending: false });
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        console.error('Supabase error fetching contracts:', fetchError);
        throw fetchError;
      }
      
      console.log('Contracts fetched successfully:', data);
      setContracts(data as ClientContract[]);
    } catch (err: any) {
      console.error('Error fetching contracts:', err);
      setError(err.message || 'Error al cargar los contratos');
      toast.error('Error al cargar los contratos');
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) {
      fetchContracts();
    }
  }, [clientId, fetchContracts]);

  const getContract = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('client_contracts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data as ClientContract;
    } catch (err: any) {
      console.error('Error fetching contract:', err);
      toast.error('Error al cargar el contrato');
      throw err;
    }
  };

  const createContract = async (contractData: CreateContractData) => {
    if (!clientId) {
      throw new Error('ID de cliente no especificado');
    }
    
    try {
      const { data, error } = await supabase
        .from('client_contracts')
        .insert({
          client_id: clientId,
          title: contractData.title,
          content: contractData.content,
          status: contractData.status || 'draft',
          client_signed: false,
          admin_signed: false
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setContracts(prev => [data as ClientContract, ...prev]);
      toast.success('Contrato creado exitosamente');
      
      return data as ClientContract;
    } catch (err: any) {
      console.error('Error creating contract:', err);
      toast.error('Error al crear el contrato');
      throw err;
    }
  };

  const updateContract = async (id: string, contractData: UpdateContractData) => {
    try {
      const { data, error } = await supabase
        .from('client_contracts')
        .update(contractData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setContracts(prev => 
        prev.map(contract => 
          contract.id === id ? data as ClientContract : contract
        )
      );
      
      toast.success('Contrato actualizado exitosamente');
      
      return data as ClientContract;
    } catch (err: any) {
      console.error('Error updating contract:', err);
      toast.error('Error al actualizar el contrato');
      throw err;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      const { error } = await supabase
        .from('client_contracts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setContracts(prev => prev.filter(contract => contract.id !== id));
      toast.success('Contrato eliminado exitosamente');
    } catch (err: any) {
      console.error('Error deleting contract:', err);
      toast.error('Error al eliminar el contrato');
      throw err;
    }
  };

  const generateShareUrl = async (id: string) => {
    try {
      console.log('Generating share URL for contract ID:', id);
      
      // Generar un UUID único para compartir
      const shareId = crypto.randomUUID();
      console.log('Generated UUID:', shareId);
      
      // Actualizar el contrato con el UUID de compartir
      const { data, error } = await supabase
        .from('client_contracts')
        .update({ shared_url: shareId })
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating contract with shared_url:', error);
        throw error;
      }
      
      console.log('Updated contract data:', data);
      
      // Actualizar la lista local de contratos
      setContracts(prev => 
        prev.map(contract => 
          contract.id === id 
            ? { ...contract, shared_url: shareId } 
            : contract
        )
      );
      
      // Now create/update a record in shared_content table
      const existingContract = contracts.find(c => c.id === id);
      
      if (existingContract) {
        // Prepare content object for shared_content
        const contractContent = {
          content: existingContract.content,
          client_signed: existingContract.client_signed,
          client_signed_at: existingContract.client_signed_at,
          client_signature: existingContract.client_signature,
          admin_signed: existingContract.admin_signed,
          admin_signed_at: existingContract.admin_signed_at,
          admin_signature: existingContract.admin_signature
        };
        
        // Get client details
        const { data: clientData } = await supabase
          .from('clients')
          .select('name, website')
          .eq('id', existingContract.client_id)
          .single();
        
        // Check if entry already exists in shared_content
        const { data: existingSharedContent } = await supabase
          .from('shared_content')
          .select('id')
          .eq('shared_url', shareId)
          .eq('content_type', 'contract')
          .single();
        
        if (existingSharedContent) {
          // Update existing shared content
          await supabase
            .from('shared_content')
            .update({
              content: contractContent,
              status: existingContract.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSharedContent.id);
        } else {
          // Create new shared content entry
          await supabase
            .from('shared_content')
            .insert({
              original_id: existingContract.id,
              content_type: 'contract',
              title: existingContract.title,
              description: '',
              content: contractContent,
              shared_url: shareId,
              status: existingContract.status,
              client_name: clientData?.name || '',
              client_website: clientData?.website || ''
            });
        }
      }
      
      // Return only the share ID, not the full URL
      return shareId;
    } catch (err: any) {
      console.error('Error generating share URL:', err);
      toast.error('Error al generar enlace para compartir');
      throw err;
    }
  };

  const signContract = async (
    id: string, 
    signature: string, 
    isAdmin: boolean = false
  ) => {
    try {
      const now = new Date().toISOString();
      
      // Prepare the update data based on who's signing
      let updateData: UpdateContractData = isAdmin 
        ? {
            admin_signed: true,
            admin_signed_at: now,
            admin_signature: signature
          }
        : {
            client_signed: true,
            client_signed_at: now,
            client_signature: signature
          };
      
      // If both parties have signed or will sign with this request, update status to 'signed'
      const contract = contracts.find(c => c.id === id);
      if (contract) {
        if (
          (isAdmin && contract.client_signed) || 
          (!isAdmin && contract.admin_signed)
        ) {
          updateData = {
            ...updateData,
            status: 'signed'
          };
        }
      }
      
      const { data, error } = await supabase
        .from('client_contracts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setContracts(prev => 
        prev.map(contract => 
          contract.id === id ? data as ClientContract : contract
        )
      );
      
      toast.success('Contrato firmado exitosamente');
      
      return data as ClientContract;
    } catch (err: any) {
      console.error('Error signing contract:', err);
      toast.error('Error al firmar el contrato');
      throw err;
    }
  };

  return {
    contracts,
    isLoading,
    error,
    getContract,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    generateShareUrl,
    signContract
  };
};
