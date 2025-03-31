
import React from 'react';
import SimpleShareDialog from './SimpleShareDialog';
import { SharedContentType } from '@/types/shared-content';

interface ShareContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  contentType: SharedContentType;
  contentTitle: string;
  contentData: any;
  contentStatus?: string;
  clientName?: string;
  clientWebsite?: string;
  onShared?: (sharedUrl: string) => void;
  onGenerateShareUrl?: () => Promise<string>;
}

// Este componente ahora es solo un wrapper alrededor del nuevo SimpleShareDialog
// para mantener compatibilidad con código existente
const ShareContentDialog: React.FC<ShareContentDialogProps> = ({
  open,
  onOpenChange,
  contentId,
  contentType,
  contentTitle,
  contentData,
  clientName = '',
  clientWebsite = '',
  onShared,
  onGenerateShareUrl
}) => {
  // Advertencia de uso
  console.warn('ShareContentDialog está obsoleto. Use SimpleShareDialog en su lugar.');
  
  return (
    <SimpleShareDialog
      open={open}
      onOpenChange={onOpenChange}
      contentId={contentId}
      contentType={contentType}
      title={contentTitle}
      data={contentData}
      clientName={clientName}
      clientWebsite={clientWebsite}
      onShared={onShared}
      onGenerateShareUrl={onGenerateShareUrl}
    />
  );
};

export default ShareContentDialog;
