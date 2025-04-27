
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseShareProposalProps {
  open: boolean;
  proposalId: string;
  proposalTitle: string;
}

export const useShareProposal = ({ open, proposalId, proposalTitle }: UseShareProposalProps) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    
    const generateShareUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data: proposalData, error: proposalError } = await supabase
          .from('client_proposals')
          .select('shared_url, client_id, clients(name, website)')
          .eq('id', proposalId)
          .single();
        
        if (proposalError) {
          throw new Error('Error al obtener la propuesta');
        }
        
        let sharedUrl = proposalData.shared_url;
        
        if (!sharedUrl) {
          const { data: updatedProposal, error: updateError } = await supabase
            .from('client_proposals')
            .update({ shared_url: crypto.randomUUID() })
            .eq('id', proposalId)
            .select('shared_url')
            .single();
          
          if (updateError) {
            throw new Error('Error al generar enlace compartido');
          }
          
          sharedUrl = updatedProposal.shared_url;
        }
        
        const { data: existingContent } = await supabase
          .from('shared_content')
          .select('id')
          .eq('shared_url', sharedUrl)
          .eq('content_type', 'proposal')
          .single();
        
        if (!existingContent) {
          const { data: fullProposal, error: fullProposalError } = await supabase
            .from('client_proposals')
            .select('*')
            .eq('id', proposalId)
            .single();
          
          if (fullProposalError) {
            throw new Error('Error al obtener datos completos de la propuesta');
          }
          
          const content = {
            services: fullProposal.services,
            price: fullProposal.price
          };
          
          // Accedemos a clients como una propiedad de tipo objeto, no como un array
          const clientsData = proposalData.clients;
          // Asegurémonos de que clientsData exista antes de acceder a sus propiedades
          const clientName = clientsData?.name || null;
          const clientWebsite = clientsData?.website || null;
          
          const { error: insertError } = await supabase
            .from('shared_content')
            .insert([{
              original_id: fullProposal.id,
              content_type: 'proposal',
              title: fullProposal.title,
              description: fullProposal.description,
              content: content,
              password: fullProposal.password,
              status: fullProposal.status,
              shared_url: sharedUrl,
              client_name: clientName,
              client_website: clientWebsite
            }]);
          
          if (insertError) {
            throw new Error('Error al crear propuesta pública');
          }
        }
        
        // Create URL with correct path format
        const fullUrl = `${window.location.origin}/shared/proposals/${sharedUrl}`;
        setShareUrl(fullUrl);
        toast.success('Enlace generado correctamente');
      } catch (error: any) {
        console.error('Error generating share URL:', error);
        setError(error.message || 'Error al generar enlace');
      } finally {
        setIsLoading(false);
      }
    };
    
    generateShareUrl();
  }, [open, proposalId]);
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('No se pudo copiar el enlace');
      console.error('Error copiando al portapapeles:', error);
    }
  };
  
  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Propuesta: ${proposalTitle}`);
    const body = encodeURIComponent(`Hola,\n\nQuiero compartir contigo esta propuesta.\n\nPuedes verla en: ${shareUrl}\n\nSaludos.`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return {
    copied,
    isLoading,
    shareUrl,
    error,
    handleCopyLink,
    handleEmailShare
  };
};
