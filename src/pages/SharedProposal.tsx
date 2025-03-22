
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ClientProposal } from '@/types/client.types';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, Clock, FileText, Loader2, Send, X } from 'lucide-react';

interface PublicProposal extends Omit<ClientProposal, 'client_id'> {
  client_name?: string;
  client_website?: string;
}

const SharedProposal = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<PublicProposal | null>(null);
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

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('ID de propuesta no especificado');
        }
        
        console.log('Fetching proposal with shared_url:', id);
        
        // Use the public_proposals view instead of the client_proposals table
        const { data, error: fetchError } = await supabase
          .from('public_proposals')
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
        
        // Type the data as PublicProposal
        const typedProposal: PublicProposal = {
          ...data,
          status: data.status as 'draft' | 'sent' | 'accepted' | 'rejected'
        };
        
        console.log('Successfully fetched proposal:', typedProposal);
        setProposal(typedProposal);
        
      } catch (err: any) {
        console.error('Error loading shared proposal:', err);
        setError(err.message || 'No se pudo cargar la propuesta');
        
        toast.error('Error: ' + (err.message || 'No se pudo cargar la propuesta'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposal();
  }, [id]);

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

  const getStatusIcon = () => {
    switch (proposal.status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'accepted':
        return <BadgeCheck className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getStatusLabel = () => {
    switch (proposal.status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviada';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return 'Desconocido';
    }
  };
  
  const getStatusColor = () => {
    switch (proposal.status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'accepted': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Logo Header */}
        {logo && (
          <div className="flex justify-center mb-8">
            <img 
              src={logo} 
              alt="Logo de la empresa" 
              className="h-16 object-contain"
            />
          </div>
        )}
        
        {/* Proposal Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
          <div className="flex justify-center mb-4">
            <span className={`text-xs px-3 py-1.5 rounded-full flex items-center ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-1.5">{getStatusLabel()}</span>
            </span>
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Última actualización: {formatDate(proposal.updated_at)}
          </div>
          {proposal.client_name && (
            <div className="text-sm text-muted-foreground mt-1">
              Propuesta para: <span className="font-medium">{proposal.client_name}</span>
            </div>
          )}
        </div>

        {/* Proposal Content */}
        <Card className="mb-8 overflow-hidden border-t-4 border-t-primary shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle>Detalles de la propuesta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {proposal.description ? (
              <div>
                <h3 className="text-lg font-medium mb-3 text-primary">Descripción</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: proposal.description }}
                />
              </div>
            ) : null}
            
            {proposal.services && proposal.services.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3 text-primary">Servicios incluidos</h3>
                <ul className="space-y-2">
                  {proposal.services.map((service, index) => (
                    <li key={index} className="bg-muted/50 p-3 rounded-md flex items-start">
                      <Badge variant="outline" className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {proposal.price && (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="text-lg font-medium mb-2 text-primary">Precio</h3>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(proposal.price)}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-6 bg-muted/10 border-t">
            <div className="w-full text-center">
              <p className="mb-4 text-muted-foreground">¿Interesado en esta propuesta?</p>
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                <a href="https://soyseolocal.com/contacto" target="_blank" rel="noopener noreferrer">
                  Contactar ahora
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
