
import React from 'react';
import SimpleShareDialog from '../../shared/SimpleShareDialog';

interface ShareInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceTitle: string;
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
  invoiceData?: any;
  onGenerateShareUrl?: () => Promise<string>;
}

const ShareInvoiceDialog: React.FC<ShareInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceTitle,
  clientName = '',
  clientWebsite = '',
  onShared,
  invoiceData,
  onGenerateShareUrl
}) => {
  if (!invoiceId) {
    console.error('ShareInvoiceDialog: invoiceId es requerido');
    return null;
  }

  return (
    <SimpleShareDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={invoiceId}
      contentType="invoice"
      title={invoiceTitle}
      data={invoiceData || { title: invoiceTitle, status: 'pending' }}
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
      onGenerateShareUrl={onGenerateShareUrl}
    />
  );
};

export default ShareInvoiceDialog;
