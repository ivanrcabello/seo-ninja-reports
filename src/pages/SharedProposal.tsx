
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PasswordProtectionDialog from '@/components/shared-content/PasswordProtectionDialog';

interface SharedProposalData {
  id: string;
  title: string;
  description?: string;
  status: string;
  price?: number;
  services?: string[];
  shared_url: string;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_website?: string;
  password_protected?: boolean;
}

const formatPrice = (price?: number) => {
  if (!price) return 'Precio no especificado';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const SharedProposal = () => {
  const { sharedUrl } = useParams<{ sharedUrl: string }>();
  const [proposal, setProposal] = useState<SharedProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const verifyPassword = async (password: string) => {
    try {
      // Call function to verify password
      const { data, error: verifyError } = await supabase
        .rpc('verify_shared_proposal_password', { 
          shared_url_param: sharedUrl || '',
          password_param: password
        });
      
      if (verifyError) throw new Error(verifyError.message);
      
      if (data === true) {
        setAccessGranted(true);
        setIsPasswordDialogOpen(false);
        toast.success('Acceso concedido');
        fetchProposal();
      } else {
        toast.error('Contraseña incorrecta');
      }
    } catch (err: any) {
      console.error("Error verifying password:", err);
      toast.error('Error al verificar la contraseña');
    }
  };

  const fetchProposal = async () => {
    if (!sharedUrl) return;
    
    try {
      setIsLoading(true);
      
      console.log("Fetching proposal with shared URL:", sharedUrl);
      
      // Check if proposal is password protected without requiring the password
      const { data: protectionData, error: protectionError } = await supabase
        .rpc('check_proposal_password_protection', { 
          shared_url_param: sharedUrl 
        });
      
      if (protectionError) throw new Error(protectionError.message);
      
      // If password protected and access not granted yet, show password dialog
      if (protectionData === true && !accessGranted) {
        setIsPasswordProtected(true);
        setIsPasswordDialogOpen(true);
        setIsLoading(false);
        return;
      }
      
      // Fetch from public_proposals directly (no RLS, no authentication required)
      const { data, error: fetchError } = await supabase
        .from('public_proposals')
        .select('*')
        .eq('shared_url', sharedUrl)
        .single();
      
      if (fetchError) {
        console.error("Error fetching proposal:", fetchError);
        throw new Error(fetchError.message);
      }
      
      if (!data) {
        throw new Error('Propuesta no encontrada');
      }
      
      console.log("Proposal data retrieved successfully:", data);
      setProposal(data as SharedProposalData);
    } catch (err: any) {
      console.error("Error in fetchProposal:", err);
      setError(err.message || 'No se pudo cargar la propuesta');
      
      toast.error('Error', { 
        description: err.message || 'No se pudo cargar la propuesta'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProposal();
  }, [sharedUrl]);

  if (isPasswordDialogOpen) {
    return (
      <PasswordProtectionDialog 
        onSubmit={verifyPassword}
        onCancel={() => setError('Acceso denegado')}
        type="proposal"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Cargando propuesta...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-red-200">
          <h1 className="text-2xl font-bold text-center text-red-600 mb-4">Error al cargar la propuesta</h1>
          <p className="text-center text-muted-foreground mb-6">
            {error || 'La propuesta solicitada no existe o ha sido eliminada.'}
          </p>
          <div className="flex justify-center">
            <a
              href="/"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/10 shadow-lg overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{proposal.title}</h1>
                <p className="text-muted-foreground">
                  {proposal.client_name} {proposal.client_website && (
                    <span>• <a href={proposal.client_website.startsWith('http') ? proposal.client_website : `https://${proposal.client_website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{proposal.client_website}</a></span>
                  )}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-1">
                <Badge className={`px-3 py-1 ${proposal.status === 'accepted' ? 'bg-green-500/20 text-green-600' : proposal.status === 'rejected' ? 'bg-red-500/20 text-red-600' : proposal.status === 'draft' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                  {proposal.status === 'accepted' ? 'Aceptada' : 
                   proposal.status === 'rejected' ? 'Rechazada' : 
                   proposal.status === 'draft' ? 'Borrador' : 'Pendiente'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Creada el {formatDate(proposal.created_at)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {proposal.description && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Descripción</h2>
                <p className="text-muted-foreground whitespace-pre-line">{proposal.description}</p>
              </div>
            )}
            
            {proposal.services && proposal.services.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-3">Servicios incluidos</h2>
                <ul className="space-y-2">
                  {proposal.services.map((service, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-5 w-5 mt-0.5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-xl">Precio total</h3>
                <p className="text-muted-foreground text-sm">Todos los precios incluyen IVA</p>
              </div>
              <div className="text-2xl font-bold">
                {formatPrice(proposal.price)}
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground">
                Para cualquier consulta sobre esta propuesta, por favor contacta con nosotros en{' '}
                <a href="mailto:info@soyseolocal.com" className="text-primary hover:underline">info@soyseolocal.com</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SharedProposal;
