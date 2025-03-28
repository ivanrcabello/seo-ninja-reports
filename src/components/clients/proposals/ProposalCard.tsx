import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeCheck, Clock, Edit, FileText, MoreHorizontal, Send, Share2, Trash2, X } from 'lucide-react';
import { ClientProposal } from '@/types/client.types';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ShareProposalDialog from './ShareProposalDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProposalCardProps {
  proposal: ClientProposal;
  onEdit: () => void;
  onDelete: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onEdit, onDelete }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
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

  const generateShareUrl = async () => {
    try {
      // Check if proposal already has a shared_url
      if (proposal.shared_url) {
        return `${window.location.origin}/shared/proposals/${proposal.shared_url}`;
      }
      
      console.log('Generating share URL for proposal ID:', proposal.id);
      
      // Generate a unique ID for sharing
      const shareId = crypto.randomUUID();
      
      // Update the proposal with the share ID
      const { error } = await supabase
        .from('client_proposals')
        .update({ shared_url: shareId })
        .eq('id', proposal.id);
        
      if (error) {
        console.error('Error updating proposal with shared_url:', error);
        throw error;
      }
      
      console.log('Generated share ID:', shareId);
      
      // Return the full share URL
      return `${window.location.origin}/shared/proposals/${shareId}`;
    } catch (error) {
      console.error('Error generating share URL:', error);
      toast.error('Error al generar enlace de compartir');
      throw error;
    }
  };
  
  // Determine the border color based on status
  const getBorderColor = () => {
    switch (proposal.status) {
      case 'draft': return 'border-t-slate-400';
      case 'sent': return 'border-t-blue-500';
      case 'accepted': return 'border-t-green-500';
      case 'rejected': return 'border-t-red-500';
      default: return 'border-t-slate-400';
    }
  };
  
  return (
    <>
      <Card className={`h-full flex flex-col shadow-md hover:shadow-lg transition-shadow border-t-4 ${getBorderColor()}`}>
        <CardHeader className="pb-2 bg-muted/20">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{proposal.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsShareDialogOpen(true)} 
                  className="cursor-pointer"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onDelete} 
                  className="text-red-600 cursor-pointer focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex space-x-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="ml-1">{getStatusLabel()}</span>
            </span>
            {proposal.price && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full flex items-center font-semibold">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(proposal.price)}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="py-3 flex-grow">
          {proposal.description ? (
            <div 
              className="text-sm text-muted-foreground mt-1 prose prose-sm max-w-full line-clamp-3"
              dangerouslySetInnerHTML={{ __html: proposal.description }}
            />
          ) : (
            <p className="text-sm text-muted-foreground italic">Sin descripción</p>
          )}
          
          {proposal.services && proposal.services.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 text-primary/80">Servicios incluidos:</h4>
              <ul className="space-y-1">
                {proposal.services.slice(0, 3).map((service, index) => (
                  <li key={index} className="text-xs bg-muted/50 px-2 py-1 rounded-md flex items-center">
                    <Badge variant="outline" className="mr-1.5 h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{service}</span>
                  </li>
                ))}
                {proposal.services.length > 3 && (
                  <li className="text-xs text-muted-foreground italic">
                    +{proposal.services.length - 3} servicios más...
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 pb-4 text-xs text-muted-foreground bg-muted/10 border-t mt-auto">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(proposal.updated_at)}
          </div>
          {proposal.shared_url && (
            <div className="ml-auto">
              <Badge variant="outline" className="text-xs">
                <Share2 className="h-3 w-3 mr-1" />
                Compartida
              </Badge>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <ShareProposalDialog 
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        proposalId={proposal.id}
        proposalTitle={proposal.title}
      />
    </>
  );
};

export default ProposalCard;
