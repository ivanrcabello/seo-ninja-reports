
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Trash2, CheckCircle, Clock, SendIcon } from 'lucide-react';
import { ClientProposal } from '@/types/client.types';
import { format } from 'date-fns';

interface ProposalCardProps {
  proposal: ClientProposal;
  onEdit: () => void;
  onDelete: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onEdit, onDelete }) => {
  const getStatusBadge = () => {
    switch (proposal.status) {
      case 'draft':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Borrador</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Enviada</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Aceptada</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rechazada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (proposal.status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'sent':
        return <SendIcon className="h-4 w-4 text-blue-600" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {proposal.title}
          </CardTitle>
          {getStatusBadge()}
        </div>
        <div className="text-xs text-muted-foreground">
          Actualizado: {format(new Date(proposal.updated_at), 'dd/MM/yyyy')}
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <p className="text-sm text-muted-foreground mb-4">
          {proposal.description}
        </p>
        
        {proposal.services && proposal.services.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Servicios incluidos:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {proposal.services.map((service, index) => (
                <li key={index} className="text-muted-foreground">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {proposal.price && (
          <div className="mt-4 bg-primary/5 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm">Precio total:</span>
              <span className="text-lg font-bold">{proposal.price}€</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/20 pt-3 flex justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getStatusIcon()}
          <span>
            {proposal.status === 'draft' ? 'Borrador' : 
             proposal.status === 'sent' ? 'Enviada' : 
             proposal.status === 'accepted' ? 'Aceptada' : 
             proposal.status === 'rejected' ? 'Rechazada' : 'Desconocido'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProposalCard;
