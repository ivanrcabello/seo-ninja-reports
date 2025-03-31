
import { useState, useEffect, useCallback } from 'react';
import { SharedProposal } from '@/types/shared-content';
import { 
  fetchProposalBySharedUrl, 
  checkProposalExists, 
  checkProposalPassword,
  verifyProposalPassword,
  logProposalAccess
} from '@/api/shared-content';
import { logError } from '@/lib/errorLogger';

export const useSharedProposalData = (sharedUrl: string) => {
  const [proposal, setProposal] = useState<SharedProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const fetchProposal = useCallback(async () => {
    if (!sharedUrl) {
      setError('URL de propuesta no proporcionada');
      setIsLoading(false);
      return;
    }

    console.log(`Iniciando obtención de propuesta con URL compartida: ${sharedUrl}`);
    setIsLoading(true);
    setError(null);

    try {
      // Primero verificar si la propuesta existe
      const { exists, error: existsError } = await checkProposalExists(sharedUrl);
      
      if (existsError) {
        logError('useSharedProposalData.checkProposalExists', existsError);
      } else if (!exists) {
        setError('La propuesta no existe');
        setIsLoading(false);
        logProposalAccess(sharedUrl, { successful: false, error: 'Proposal not found' }, 'check');
        return;
      }
      
      // Verificar si está protegida con contraseña
      const { isProtected, error: protectionError } = await checkProposalPassword(sharedUrl);
      
      if (protectionError) {
        logError('useSharedProposalData.checkProposalPassword', protectionError);
      } else {
        setIsPasswordProtected(isProtected);
        
        // Si está protegida y no se ha concedido acceso, no obtener contenido aún
        if (isProtected && !accessGranted) {
          setIsLoading(false);
          return;
        }
      }

      // Obtener datos de la propuesta
      const { data: proposalData, error: fetchError } = await fetchProposalBySharedUrl(sharedUrl);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (!proposalData) {
        throw new Error('No se pudo encontrar la propuesta solicitada');
      }
      
      setProposal(proposalData);
      logProposalAccess(sharedUrl, { successful: true }, 'view');
      
    } catch (err: any) {
      logError('useSharedProposalData.fetchProposal', err);
      setError(err.message || 'Error al cargar la propuesta');
      logProposalAccess(sharedUrl, { successful: false, error: err.message || 'Unknown error' }, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [sharedUrl, accessGranted]);

  const verifyPassword = async (password: string): Promise<boolean> => {
    try {
      const success = await verifyProposalPassword(sharedUrl, password);
      
      if (success) {
        setAccessGranted(true);
        // Volver a obtener con acceso concedido
        fetchProposal();
      }
      
      return success;
    } catch (error) {
      logError('useSharedProposalData.verifyPassword', error);
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
    accessGranted,
    verifyPassword,
    refetch: fetchProposal
  };
};
