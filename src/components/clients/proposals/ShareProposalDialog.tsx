
import React from 'react';
import ShareContentDialog from '../../shared/ShareContentDialog';

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
  return (
    <ShareContentDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={proposalId}
      contentType="proposal"
      contentTitle={proposalTitle}
      contentData={proposalData || { title: proposalTitle }}
      contentStatus="active"
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
    />
  );
};

export default ShareProposalDialog;
