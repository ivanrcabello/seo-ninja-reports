
import { useState, useEffect, useCallback } from 'react';
import { SharedProposal, AccessLogOptions } from '@/types/shared-content';
import { 
  fetchProposalBySharedUrl, 
  checkContentExists, 
  checkContentPasswordProtection, 
  verifyContentPassword,
  logContentAccess 
} from '@/api/shared-content';
import { logError } from '@/lib/errorLogger';

export const useProposalData = (proposalId?: string) => {
  const [proposal, setProposal] = useState<SharedProposal | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState<boolean>(false);

  const fetchProposal = useCallback(async () => {
    if (!proposalId) {
      setError('ID de propuesta no especificado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Verificar si la propuesta existe
      const { exists, error: existsError } = await checkContentExists(proposalId, 'proposal');
      
      if (existsError) {
        throw existsError;
      }
      
      if (!exists) {
        setError('Propuesta no encontrada');
        setLoading(false);
        
        const options: AccessLogOptions = { 
          successful: false, 
          error: 'Proposal not found' 
        };
        logContentAccess('proposal', proposalId, options, 'check');
        return;
      }

      // Verificar si está protegida con contraseña
      const { isProtected, error: protectedError } = await checkContentPasswordProtection(proposalId, 'proposal');
      
      if (protectedError) {
        throw protectedError;
      }
      
      setIsPasswordProtected(isProtected);
      
      // Si no está protegida o ya se ha verificado, obtener la propuesta
      if (!isProtected || isPasswordVerified) {
        const { data: proposalData, error: fetchError } = await fetchProposalBySharedUrl(proposalId);
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (!proposalData) {
          throw new Error('No se pudo encontrar la propuesta solicitada');
        }
        
        setProposal(proposalData);
        
        // Registrar acceso exitoso
        const options: AccessLogOptions = { successful: true };
        logContentAccess('proposal', proposalId, options, 'view');
      } else {
        setLoading(false);
      }
    } catch (err: any) {
      logError('useProposalData.fetchProposal', err);
      setError(err.message || 'Error al cargar la propuesta');
      
      // Registrar error
      const options: AccessLogOptions = { 
        successful: false, 
        error: err.message || 'Unknown error' 
      };
      logContentAccess('proposal', proposalId, options, 'error');
    } finally {
      setLoading(false);
    }
  }, [proposalId, isPasswordVerified]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    if (!proposalId) return false;

    try {
      const verified = await verifyContentPassword(proposalId, 'proposal', password);
      
      if (verified) {
        setIsPasswordVerified(true);
        await fetchProposal();
        return true;
      } else {
        return false;
      }
    } catch (err) {
      logError('useProposalData.verifyPassword', err);
      return false;
    }
  };

  const handlePrint = () => {
    // Registrar evento de impresión
    const options: AccessLogOptions = { successful: true };
    if (proposalId) {
      logContentAccess('proposal', proposalId, options, 'print');
    }
    window.print();
  };

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return {
    proposal,
    loading,
    error,
    isPasswordProtected,
    isPasswordVerified,
    verifyPassword,
    handlePrint,
    refetch: fetchProposal
  };
};

export default useProposalData;
