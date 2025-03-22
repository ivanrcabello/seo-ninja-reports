
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BadgeCheck, Clock, Edit, Eye, FileText, FilePen, MoreHorizontal, 
  Send, Share2, Trash2, X, HandshakeIcon, Ban 
} from 'lucide-react';
import { ClientContract } from '@/types/client.types';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ShareContractDialog from './ShareContractDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContractCardProps {
  contract: ClientContract;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract, onEdit, onDelete, onView }) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const getStatusIcon = () => {
    switch (contract.status) {
      case 'draft':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'signed':
        return <BadgeCheck className="h-4 w-4 text-green-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
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
      // Check if contract already has a shared_url
      if (contract.shared_url) {
        return `${window.location.origin}/shared/contracts/${contract.shared_url}`;
      }
      
      console.log('Generating share URL for contract ID:', contract.id);
      
      // Generate a unique ID for sharing
      const shareId = crypto.randomUUID();
      
      // Update the contract with the share ID
      const { error } = await supabase
        .from('client_contracts')
        .update({ shared_url: shareId })
        .eq('id', contract.id);
        
      if (error) {
        console.error('Error updating contract with shared_url:', error);
        throw error;
      }
      
      console.log('Generated share ID:', shareId);
      
      // Return the full share URL
      return `${window.location.origin}/shared/contracts/${shareId}`;
    } catch (error) {
      console.error('Error generating share URL:', error);
      toast.error('Error al generar enlace de compartir');
      throw error;
    }
  };
  
  // Determine the border color based on status
  const getBorderColor = () => {
    switch (contract.status) {
      case 'draft': return 'border-t-slate-400';
      case 'sent': return 'border-t-blue-500';
      case 'signed': return 'border-t-green-500';
      case 'expired': return 'border-t-yellow-500';
      case 'cancelled': return 'border-t-red-500';
      default: return 'border-t-slate-400';
    }
  };

  // Determine the signing status
  const getSigningStatus = () => {
    if (contract.client_signed && contract.admin_signed) {
      return (
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          <BadgeCheck className="mr-1 h-3 w-3" />
          Firmado por ambas partes
        </Badge>
      );
    } else if (contract.client_signed) {
      return (
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          <FilePen className="mr-1 h-3 w-3" />
          Firmado por cliente
        </Badge>
      );
    } else if (contract.admin_signed) {
      return (
        <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
          <FilePen className="mr-1 h-3 w-3" />
          Firmado por administrador
        </Badge>
      );
    }
    return null;
  };
  
  return (
    <>
      <Card className={`h-full flex flex-col shadow-md hover:shadow-lg transition-shadow border-t-4 ${getBorderColor()}`}>
        <CardHeader className="pb-2 bg-muted/20">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{contract.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </DropdownMenuItem>
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
          </div>
        </CardHeader>
        <CardContent className="py-3 flex-grow">
          <div className="text-sm text-muted-foreground">
            <p className="mb-4">
              {contract.content.length > 100 
                ? contract.content.substring(0, 100).replace(/<\/?[^>]+(>|$)/g, "") + "..." 
                : contract.content.replace(/<\/?[^>]+(>|$)/g, "")}
            </p>
            
            {getSigningStatus() && (
              <div className="mt-2">
                {getSigningStatus()}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4 text-xs text-muted-foreground bg-muted/10 border-t mt-auto">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(contract.updated_at)}
          </div>
          {contract.shared_url && (
            <div className="ml-auto">
              <Badge variant="outline" className="text-xs">
                <Share2 className="h-3 w-3 mr-1" />
                Compartido
              </Badge>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <ShareContractDialog 
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        contractId={contract.id}
        contractTitle={contract.title}
        onGenerateShareUrl={generateShareUrl}
      />
    </>
  );
};

export default ContractCard;
