
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ClientProposal } from '@/types/client.types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const SharedProposal = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<ClientProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('ID de propuesta no especificado');
        }
        
        console.log('Fetching proposal with shared_url:', id);
        
        // Fetch the proposal directly without joining with clients table
        // This avoids potential RLS recursion issues
        const { data, error: fetchError } = await supabase
          .from('client_proposals')
          .select('*')
          .eq('shared_url', id)
          .single();
        
        if (fetchError) {
          console.error('Error fetching shared proposal:', fetchError);
          throw new Error(`Error al cargar propuesta: ${fetchError.message}`);
        }
        
        if (!data) {
          console.error('No proposal found with shared_url:', id);
          throw new Error(`Propuesta no encontrada`);
        }
        
        // Type the data as ClientProposal
        const typedProposal: ClientProposal = {
          ...data,
          status: data.status as 'draft' | 'sent' | 'accepted' | 'rejected'
        };
        
        console.log('Successfully fetched proposal:', typedProposal);
        setProposal(typedProposal);
        
      } catch (err: any) {
        console.error('Error loading shared proposal:', err);
        setError(err.message || 'No se pudo cargar la propuesta');
        
        toast({
          title: 'Error',
          description: err.message || 'No se pudo cargar la propuesta',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposal();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {error || 'No se pudo cargar la propuesta'}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Volver
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { 
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Fecha desconocida';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Proposal Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-4">{proposal.title}</h1>
          <div className="text-sm text-muted-foreground">
            Última actualización: {formatDate(proposal.updated_at)}
          </div>
        </div>

        {/* Proposal Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detalles de la propuesta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {proposal.description ? (
              <div>
                <h3 className="text-lg font-medium mb-2">Descripción</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: proposal.description }}
                />
              </div>
            ) : null}
            
            {proposal.services && proposal.services.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Servicios incluidos</h3>
                <ul className="space-y-2">
                  {proposal.services.map((service, index) => (
                    <li key={index} className="bg-muted/50 p-2 rounded-md">
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {proposal.price && (
              <div>
                <h3 className="text-lg font-medium mb-2">Precio</h3>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(proposal.price)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full text-center">
              <p className="mb-4 text-muted-foreground">¿Interesado en esta propuesta?</p>
              <Button asChild className="w-full sm:w-auto">
                <a href="https://soyseolocal.com/contacto" target="_blank" rel="noopener noreferrer">
                  Contactar
                </a>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SharedProposal;
