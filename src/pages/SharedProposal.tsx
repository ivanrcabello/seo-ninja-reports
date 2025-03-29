
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProposalData } from '@/components/shared-proposal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import PasswordProtectionDialog from '@/components/shared/PasswordProtectionDialog';
import { Skeleton } from '@/components/ui/skeleton';

const SharedProposal: React.FC = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const {
    proposal,
    isLoading,
    error,
    isPasswordProtected,
    accessGranted,
    verifyPassword,
    refetch
  } = useProposalData(proposalId);
  
  const handleVerifyPassword = async () => {
    setVerifying(true);
    setShowError(false);
    
    const success = await verifyPassword(passwordInput);
    
    if (success) {
      await refetch();
    } else {
      setShowError(true);
    }
    
    setVerifying(false);
  };
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-4 h-4 mr-1" /> Aceptada
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-4 h-4 mr-1" /> Pendiente
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500 text-white">
            <AlertCircle className="w-4 h-4 mr-1" /> Rechazada
          </Badge>
        );
      default:
        return (
          <Badge>
            {status}
          </Badge>
        );
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Separator />
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Ha ocurrido un error</h2>
            <p className="text-muted-foreground">{error}</p>
          </Card>
        </div>
      </div>
    );
  }
  
  // Show password protection dialog
  if (isPasswordProtected && !accessGranted) {
    return (
      <PasswordProtectionDialog
        isOpen={true}
        onClose={() => {}}
        title="Propuesta Protegida"
        description="Esta propuesta está protegida con contraseña. Por favor, introduce la contraseña para acceder."
        password={passwordInput}
        setPassword={setPasswordInput}
        onVerify={handleVerifyPassword}
        isVerifying={verifying}
        showError={showError}
        errorMessage="Contraseña incorrecta. Por favor, inténtalo de nuevo."
      />
    );
  }
  
  // Show empty state if no proposal found
  if (!proposal) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Propuesta no encontrada</h2>
            <p className="text-muted-foreground">Esta propuesta no existe o no está disponible.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{proposal.title}</h1>
                  <p className="text-muted-foreground mt-1">
                    Propuesta para {proposal.client_name}
                    {proposal.client_website && (
                      <> — <a href={proposal.client_website.startsWith('http') ? proposal.client_website : `https://${proposal.client_website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline">
                        {proposal.client_website}
                      </a>
                      </>
                    )}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {renderStatusBadge(proposal.status)}
                  {proposal.price !== undefined && (
                    <div className="text-xl font-bold">
                      {formatCurrency(proposal.price)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {proposal.description && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Descripción</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p>{proposal.description}</p>
                </div>
              </div>
            )}
            
            {proposal.services && Array.isArray(proposal.services) && proposal.services.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Servicios incluidos</h2>
                <ul className="grid grid-cols-1 gap-3 pl-0 list-none">
                  {proposal.services.map((service: string, index: number) => (
                    <li key={index} className="bg-muted p-3 rounded-md flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-6">
              <Button variant="outline">
                Descargar PDF
              </Button>
              <Button>
                Aceptar propuesta
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SharedProposal;
