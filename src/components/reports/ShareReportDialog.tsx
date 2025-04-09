
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useShareReport } from './share-dialog/useShareReport';
import ShareUrlSection from './share-dialog/ShareUrlSection';
import ShareActionButtons from './share-dialog/ShareActionButtons';
import PasswordProtectionSection from './share-dialog/PasswordProtectionSection';
import LoadingState from './share-dialog/LoadingState';
import ErrorState from './share-dialog/ErrorState';

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  reportTitle: string;
}

const ShareReportDialog: React.FC<ShareReportDialogProps> = ({
  open,
  onOpenChange,
  reportId,
  reportTitle
}) => {
  const {
    copied,
    isLoading,
    shareUrl,
    passwordProtected,
    setPasswordProtected,
    password,
    setPassword,
    error,
    handleCopyLink,
    handleEmailShare,
    handleUpdatePassword,
    generateRandomPassword
  } = useShareReport({ open, reportId, reportTitle });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass">
        <DialogHeader>
          <DialogTitle>Compartir Informe</DialogTitle>
          <DialogDescription>
            Comparte este informe mediante un enlace directo.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onClose={() => onOpenChange(false)} />
          ) : (
            <>
              <ShareUrlSection 
                shareUrl={shareUrl}
                copied={copied}
                onCopyLink={handleCopyLink}
              />
              
              <ShareActionButtons 
                onCopyLink={handleCopyLink}
                onEmailShare={handleEmailShare}
              />
              
              <PasswordProtectionSection
                passwordProtected={passwordProtected}
                setPasswordProtected={setPasswordProtected}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                onUpdatePassword={handleUpdatePassword}
                generateRandomPassword={generateRandomPassword}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportDialog;
