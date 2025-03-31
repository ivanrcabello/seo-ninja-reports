
import React from 'react';
import ShareContentDialog from '../../shared/ShareContentDialog';

interface ShareInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  invoiceTitle: string;
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
  invoiceData?: any;
}

const ShareInvoiceDialog: React.FC<ShareInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoiceId,
  invoiceTitle,
  clientName = '',
  clientWebsite = '',
  onShared,
  invoiceData
}) => {
  if (!invoiceId) {
    console.error('ShareInvoiceDialog: invoiceId es requerido');
    return null;
  }

  console.log('ShareInvoiceDialog - ID:', invoiceId);
  
  return (
    <ShareContentDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={invoiceId}
      contentType="invoice"
      contentTitle={invoiceTitle}
      contentData={invoiceData || { title: invoiceTitle }}
      contentStatus="pending"
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
    />
  );
};

export default ShareInvoiceDialog;
