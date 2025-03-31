
import React from 'react';
import { SharedProposal } from '@/types/shared-content';
import { formatDate } from '@/lib/utils';

interface ProposalHeaderProps {
  proposal: SharedProposal;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposal }) => {
  return (
    <header className="bg-card p-6 border-b border-border">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">{proposal.title}</h1>
        
        <div className="flex flex-col gap-2 mt-4">
          {proposal.client_name && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Cliente:</span> {proposal.client_name}
            </p>
          )}
          
          {proposal.client_website && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Sitio web:</span>{' '}
              <a 
                href={proposal.client_website.startsWith('http') ? proposal.client_website : `https://${proposal.client_website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {proposal.client_website}
              </a>
            </p>
          )}
          
          {proposal.created_at && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Fecha:</span> {formatDate(new Date(proposal.created_at))}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProposalHeader;
