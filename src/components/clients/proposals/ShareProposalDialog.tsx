
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, ExternalLink } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShareProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string;
  clientId: string;
  title: string;
}

const ShareProposalDialog: React.FC<ShareProposalDialogProps> = ({
  open,
  onOpenChange,
  proposalId,
  clientId,
  title
}) => {
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState<{ name: string, website: string } | null>(null);

  const baseUrl = window.location.origin;

  // Fetch any existing shared URL and client details when dialog opens
  useEffect(() => {
    if (open && proposalId) {
      fetchExistingShareDetails();
      fetchClientDetails();
    }
  }, [open, proposalId]);

  const fetchExistingShareDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('client_proposals')
        .select('shared_url, password')
        .eq('id', proposalId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSharedUrl(data.shared_url || null);
        setIsProtected(!!data.password);
        if (data.password) {
          setPassword(""); // Don't show the actual password for security
        }
      }
    } catch (error) {
      console.error('Error fetching share details:', error);
      toast.error('Error al cargar los detalles de compartición');
    }
  };

  const fetchClientDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('name, website')
        .eq('id', clientId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setClientDetails(data);
      }
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const handleShareProposal = async () => {
    setIsLoading(true);
    
    try {
      const sharedUrlValue = sharedUrl || crypto.randomUUID();
      
      const { error } = await supabase
        .from('client_proposals')
        .update({
          shared_url: sharedUrlValue,
          password: isProtected ? password : null
        })
        .eq('id', proposalId);
        
      if (error) throw error;
      
      setSharedUrl(sharedUrlValue);
      toast.success('Enlace de la propuesta actualizado');
      
      // Also update public_proposals view
      await updatePublicProposals(sharedUrlValue);
      
    } catch (error) {
      console.error('Error sharing proposal:', error);
      toast.error('Error al compartir la propuesta');
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePublicProposals = async (sharedUrlValue: string) => {
    try {
      if (!clientDetails) return;
      
      // Find if there's already a public proposal with this shared_url
      const { data: existingPublicProposal, error: checkError } = await supabase
        .from('public_proposals')
        .select('id')
        .eq('shared_url', sharedUrlValue)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingPublicProposal) {
        // Update existing record
        await supabase
          .from('public_proposals')
          .update({
            client_name: clientDetails.name,
            client_website: clientDetails.website,
            updated_at: new Date().toISOString()
          })
          .eq('shared_url', sharedUrlValue);
      }
      
    } catch (error) {
      console.error('Error updating public proposals:', error);
    }
  };

  const copyLinkToClipboard = () => {
    if (!sharedUrl) return;
    
    const shareLink = `${baseUrl}/proposals/shared/${sharedUrl}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Enlace copiado al portapapeles');
  };

  const openSharedLink = () => {
    if (!sharedUrl) return;
    
    const shareLink = `${baseUrl}/proposals/shared/${sharedUrl}`;
    window.open(shareLink, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Propuesta</DialogTitle>
          <DialogDescription>
            Compartir propuesta: {title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="protected"
              checked={isProtected}
              onCheckedChange={setIsProtected}
            />
            <Label htmlFor="protected">Proteger con contraseña</Label>
          </div>

          {isProtected && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese una contraseña"
              />
            </div>
          )}

          {sharedUrl && (
            <div className="space-y-2">
              <Label>Enlace compartido</Label>
              <div className="flex">
                <Input
                  value={`${baseUrl}/proposals/shared/${sharedUrl}`}
                  readOnly
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-2" 
                  onClick={copyLinkToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={openSharedLink}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
          <Button 
            onClick={handleShareProposal} 
            disabled={isProtected && !password || isLoading}
          >
            {isLoading ? 'Compartiendo...' : (sharedUrl ? 'Actualizar enlace' : 'Generar enlace')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProposalDialog;
