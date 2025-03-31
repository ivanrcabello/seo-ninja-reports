
import React from 'react';
import ShareContentDialog from '../../shared/ShareContentDialog';

interface ShareContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  contractTitle: string;
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
  contractData?: any;
  onGenerateShareUrl?: () => Promise<string>;
}

const ShareContractDialog: React.FC<ShareContractDialogProps> = ({
  open,
  onOpenChange,
  contractId,
  contractTitle,
  clientName = '',
  clientWebsite = '',
  onShared,
  contractData,
  onGenerateShareUrl
}) => {
  return (
    <ShareContentDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={contractId}
      contentType="contract"
      contentTitle={contractTitle}
      contentData={contractData || { title: contractTitle }}
      contentStatus="draft"
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
    />
  );
};

export default ShareContractDialog;
