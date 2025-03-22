
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ClientContract } from '@/types/client.types';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, Clock, Download, FileText, FilePen, Loader2, Pencil, Send, X, Ban } from 'lucide-react';
import SignatureDialog from '@/components/clients/contracts/SignatureDialog';

interface PublicContract extends Omit<ClientContract, 'client_id'> {
  client_name?: string;
  client_website?: string;
}

const SharedContract = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<PublicContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);

  // Fetch the company logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'company_logo')
          .single();
        
        if (error) {
          console.error('Error fetching logo:', error);
          return;
        }
        
        if (data && data.value) {
          setLogo(data.value);
        }
      } catch (err) {
        console.error('Failed to fetch logo:', err);
      }
    };
    
    fetchLogo();
  }, []);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error('ID de contrato no especificado');
        }
        
        console.log('Fetching contract with shared_url:', id);
        
        // Use the public_contracts view
        const { data, error: fetchError } = await supabase
          .from('public_contracts')
          .select('*')
          .eq('shared_url', id)
          .single();
        
        if (fetchError) {
          console.error('Error fetching shared contract:', fetchError);
          throw new Error(`Error al cargar contrato: ${fetchError.message}`);
        }
        
        if (!data) {
          console.error('No contract found with shared_url:', id);
          throw new Error(`Contrato no encontrado`);
        }
        
        // Type the data as PublicContract
        const typedContract: PublicContract = {
          ...data,
          status: data.status as 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled'
        };
        
        console.log('Successfully fetched contract:', typedContract);
        setContract(typedContract);
        
      } catch (err: any) {
        console.error('Error loading shared contract:', err);
        setError(err.message || 'No se pudo cargar el contrato');
        
        toast({
          title: 'Error',
          description: err.message || 'No se pudo cargar el contrato',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchContract();
  }, [id]);

  const handleSignContract = async (signature: string) => {
    try {
      if (!id || !contract) return;
      
      const now = new Date().toISOString();
      
      // Actualizar el contrato con la firma del cliente
      const { error } = await supabase
        .from('client_contracts')
        .update({
          client_signed: true,
          client_signed_at: now,
          client_signature: signature,
          // Si el admin ya firmó, cambiar el estado a 'signed'
          ...(contract.admin_signed ? { status: 'signed' } : {})
        })
        .eq('shared_url', id);
        
      if (error) throw error;
      
      // Actualizar el estado local
      setContract(prev => {
        if (!prev) return null;
        return {
          ...prev,
          client_signed: true,
          client_signed_at: now,
          client_signature: signature,
          ...(prev.admin_signed ? { status: 'signed' } : {})
        };
      });
      
      setIsSignDialogOpen(false);
      toast.success('Contrato firmado exitosamente');
    } catch (error: any) {
      console.error('Error signing contract:', error);
      toast.error('Error al firmar el contrato: ' + error.message);
    }
  };

  const handlePrint = () => {
    if (!contract) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes para imprimir.');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${contract.title} - Contrato</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .signatures { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { border-top: 1px solid #000; padding-top: 10px; text-align: center; width: 40%; }
          </style>
        </head>
        <body>
          <h1 style="text-align: center;">${contract.title}</h1>
          <div>${contract.content}</div>
          
          <div class="signatures">
            <div class="signature-box">
              ${contract.admin_signature ? `
                <img src="${contract.admin_signature}" style="max-height: 60px;" />
                <p>Firma Administrador</p>
                <p>Fecha: ${contract.admin_signed_at ? new Date(contract.admin_signed_at).toLocaleDateString('es-ES') : 'No firmado'}</p>
              ` : 'Administrador (Pendiente de firma)'}
            </div>
            
            <div class="signature-box">
              ${contract.client_signature ? `
                <img src="${contract.client_signature}" style="max-height: 60px;" />
                <p>Firma Cliente</p>
                <p>Fecha: ${contract.client_signed_at ? new Date(contract.client_signed_at).toLocaleDateString('es-ES') : 'No firmado'}</p>
              ` : 'Cliente (Pendiente de firma)'}
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Imprimir después de que todo el contenido esté cargado
    setTimeout(() => {
      printWindow.print();
      //printWindow.close();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              {error || 'No se pudo cargar el contrato'}
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
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
    switch (contract.status) {
      case 'draft':
        return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'sent':
        return <Send className="h-5 w-5 text-blue-500" />;
      case 'signed':
        return <BadgeCheck className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <Ban className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getStatusLabel = () => {
    switch (contract.status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviado';
      case 'signed': return 'Firmado';
      case 'expired': return 'Vencido';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };
  
  const getStatusColor = () => {
    switch (contract.status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'signed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'expired': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
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
          
          {/* Contract Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">{contract.title}</h1>
            <div className="flex justify-center mb-4">
              <span className={`text-sm px-3 py-1.5 rounded-full flex items-center ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="ml-1.5">{getStatusLabel()}</span>
              </span>
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Última actualización: {formatDate(contract.updated_at)}
            </div>
            {contract.client_name && (
              <div className="text-sm text-muted-foreground mt-1">
                Contrato para: <span className="font-medium">{contract.client_name}</span>
              </div>
            )}
          </div>

          {/* Contract Content */}
          <Card className="mb-8 overflow-hidden border-t-4 border-t-primary shadow-md">
            <CardHeader className="bg-muted/30">
              <CardTitle>Detalles del Contrato</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: contract.content }}
              />
            </CardContent>
            <CardFooter className="p-6 flex-col items-start bg-muted/10 border-t">
              {/* Sección de firmas si hay alguna */}
              {(contract.admin_signature || contract.client_signature) && (
                <div className="w-full mb-6">
                  <h4 className="text-sm font-medium mb-4">Firmas</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contract.admin_signature && (
                      <div className="border rounded-md p-4 bg-white dark:bg-muted">
                        <div className="text-xs text-muted-foreground mb-2">Firma del Administrador</div>
                        <div className="flex justify-center border-t pt-2">
                          <img 
                            src={contract.admin_signature} 
                            alt="Firma del Administrador" 
                            className="max-h-16 object-contain" 
                          />
                        </div>
                        <div className="text-xs text-center text-muted-foreground mt-2">
                          {contract.admin_signed_at 
                            ? new Date(contract.admin_signed_at).toLocaleDateString('es-ES', {
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) 
                            : 'Fecha no disponible'}
                        </div>
                      </div>
                    )}
                    
                    {contract.client_signature && (
                      <div className="border rounded-md p-4 bg-white dark:bg-muted">
                        <div className="text-xs text-muted-foreground mb-2">Firma del Cliente</div>
                        <div className="flex justify-center border-t pt-2">
                          <img 
                            src={contract.client_signature} 
                            alt="Firma del Cliente" 
                            className="max-h-16 object-contain" 
                          />
                        </div>
                        <div className="text-xs text-center text-muted-foreground mt-2">
                          {contract.client_signed_at 
                            ? new Date(contract.client_signed_at).toLocaleDateString('es-ES', {
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) 
                            : 'Fecha no disponible'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-4">
                {/* Botón para firmar si el cliente aún no ha firmado */}
                {!contract.client_signed && contract.status !== 'cancelled' && contract.status !== 'expired' && (
                  <Button 
                    onClick={() => setIsSignDialogOpen(true)}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Firmar como Cliente
                  </Button>
                )}
                
                {/* Botón para descargar/imprimir siempre visible */}
                <Button 
                  variant="outline" 
                  onClick={handlePrint}
                  className="w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Imprimir / Guardar PDF
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Información de contacto */}
          <div className="text-center text-sm text-muted-foreground mt-8">
            <p>Si tienes alguna pregunta sobre este contrato, puedes contactarnos en:</p>
            <div className="mt-2">
              <a href="mailto:info@soyseolocal.com" className="text-primary hover:underline">info@soyseolocal.com</a>
              <span className="mx-2">|</span>
              <a href="tel:+34600000000" className="text-primary hover:underline">+34 600 000 000</a>
            </div>
          </div>
        </div>
      </div>
      
      <SignatureDialog 
        open={isSignDialogOpen}
        onOpenChange={setIsSignDialogOpen}
        onSign={handleSignContract}
        isAdmin={false}
      />
    </>
  );
};

export default SharedContract;
