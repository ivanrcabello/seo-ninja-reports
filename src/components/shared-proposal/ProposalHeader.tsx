
import React from 'react';
import { SharedProposal } from '@/types/shared-content';
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Globe } from "lucide-react";
import { formatDate } from '@/lib/utils';

interface ProposalHeaderProps {
  proposal: SharedProposal;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'accepted':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'draft':
      return 'bg-slate-500';
    case 'sent':
      return 'bg-blue-500';
    case 'expired':
      return 'bg-gray-500';
    default:
      return 'bg-slate-500';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'accepted':
      return 'Aceptada';
    case 'rejected':
      return 'Rechazada';
    case 'pending':
      return 'Pendiente';
    case 'draft':
      return 'Borrador';
    case 'sent':
      return 'Enviada';
    case 'expired':
      return 'Expirada';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposal }) => {
  const statusColor = getStatusColor(proposal.status);
  const statusText = getStatusText(proposal.status);

  return (
    <div className="bg-primary/10 p-6 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{proposal.title}</h1>
          
          <div className="mt-2 flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
            {proposal.created_at && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>{formatDate(new Date(proposal.created_at))}</span>
              </div>
            )}
            
            {proposal.client_website && (
              <div className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                <a 
                  href={proposal.client_website.startsWith('http') ? proposal.client_website : `https://${proposal.client_website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {proposal.client_website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-2">
          {proposal.client_name && (
            <div className="text-sm font-medium">
              <span className="text-muted-foreground">Cliente: </span>
              <span>{proposal.client_name}</span>
            </div>
          )}
          
          <Badge className={`${statusColor}`}>
            {statusText}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ProposalHeader;
