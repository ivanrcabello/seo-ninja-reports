
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface ShareProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string;
  proposalTitle?: string;
}

const ShareProposalDialog: React.FC<ShareProposalDialogProps> = ({
  open,
  onOpenChange,
  proposalId,
  proposalTitle = "Propuesta"
}) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset state when dialog opens or closes
  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setCopied(false);
      return;
    }
    
    // Generate URL when dialog opens
    const generateShareUrl = async () => {
      try {
        setIsLoading(true);
        
        // Verificar si la propuesta ya tiene un shared_url
        const { data: proposalData, error: proposalError } = await supabase
          .from('client_proposals')
          .select('shared_url, client_id, clients(name, website)')
          .eq('id', proposalId)
          .single();
        
        if (proposalError) {
          throw new Error('Error al obtener la propuesta');
        }
        
        let sharedUrl = proposalData.shared_url;
        
        // Si no tiene shared_url, generamos uno
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
        
        // Verificar si ya existe en public_proposals
        const { data: existingPublic } = await supabase
          .from('public_proposals')
          .select('id')
          .eq('shared_url', sharedUrl)
          .single();
        
        // Si no existe en public_proposals, lo creamos
        if (!existingPublic) {
          // Obtenemos todos los datos de la propuesta
          const { data: fullProposal, error: fullProposalError } = await supabase
            .from('client_proposals')
            .select('*')
            .eq('id', proposalId)
            .single();
          
          if (fullProposalError) {
            throw new Error('Error al obtener datos completos de la propuesta');
          }
          
          // Insertamos en public_proposals con type assertion
          const { error: insertError } = await supabase
            .from('public_proposals')
            .insert([{
              id: fullProposal.id,
              title: fullProposal.title,
              description: fullProposal.description,
              status: fullProposal.status,
              price: fullProposal.price,
              services: fullProposal.services,
              shared_url: sharedUrl,
              created_at: fullProposal.created_at,
              updated_at: fullProposal.updated_at,
              client_name: proposalData.clients?.name,
              client_website: proposalData.clients?.website
            }] as any);
          
          if (insertError) {
            throw new Error('Error al crear propuesta pública');
          }
        }
        
        // Construir la URL completa
        const fullUrl = `${window.location.origin}/shared/proposals/${sharedUrl}`;
        setShareUrl(fullUrl);
        toast.success('Enlace generado correctamente');
      } catch (error: any) {
        console.error('Error generating share URL:', error);
        toast.error('Error: ' + (error.message || 'Error al generar enlace'));
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
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Propuesta</DialogTitle>
          <DialogDescription>
            Comparte esta propuesta mediante un enlace directo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <p>Generando enlace...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="w-full"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyLink} 
                  className="transition-all group hover:bg-primary hover:text-primary-foreground"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500 group-hover:text-primary-foreground" />
                  ) : (
                    <Copy className="h-4 w-4 group-hover:text-primary-foreground" />
                  )}
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleCopyLink} 
                  className="w-full sm:w-auto gap-2 group"
                >
                  <Link className="h-4 w-4 group-hover:animate-pulse" />
                  Copiar enlace
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleEmailShare} 
                  className="w-full sm:w-auto gap-2 group transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Mail className="h-4 w-4 group-hover:animate-pulse" />
                  Compartir por email
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProposalDialog;
