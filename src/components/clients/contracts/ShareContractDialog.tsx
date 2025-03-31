
import React from 'react';
import SimpleShareDialog from '../../shared/SimpleShareDialog';

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
  if (!contractId) {
    console.error('ShareContractDialog: contractId es requerido');
    return null;
  }

  return (
    <SimpleShareDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={contractId}
      contentType="contract"
      title={contractTitle}
      data={contractData || { title: contractTitle, status: 'draft' }}
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
      onGenerateShareUrl={onGenerateShareUrl}
    />
  );
};

export default ShareContractDialog;
