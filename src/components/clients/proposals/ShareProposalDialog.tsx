
import React from 'react';
import SimpleShareDialog from '../../shared/SimpleShareDialog';

interface ShareProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string;
  proposalTitle: string;
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
  proposalData?: any;
}

const ShareProposalDialog: React.FC<ShareProposalDialogProps> = ({
  open,
  onOpenChange,
  proposalId,
  proposalTitle,
  clientName = '',
  clientWebsite = '',
  onShared,
  proposalData
}) => {
  if (!proposalId) {
    console.error('ShareProposalDialog: proposalId es requerido');
    return null;
  }

  return (
    <SimpleShareDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={proposalId}
      contentType="proposal"
      title={proposalTitle}
      data={proposalData || { title: proposalTitle, status: 'active' }}
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
    />
  );
};

export default ShareProposalDialog;
