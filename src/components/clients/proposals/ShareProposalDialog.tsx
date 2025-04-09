
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useShareProposal } from './share-dialog/useShareProposal';
import ShareUrlSection from '@/components/reports/share-dialog/ShareUrlSection';
import ShareActionButtons from '@/components/reports/share-dialog/ShareActionButtons';
import LoadingState from '@/components/reports/share-dialog/LoadingState';
import ErrorState from '@/components/reports/share-dialog/ErrorState';

interface ShareProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalId: string;
  proposalTitle: string;
}

const ShareProposalDialog: React.FC<ShareProposalDialogProps> = ({
  open,
  onOpenChange,
  proposalId,
  proposalTitle
}) => {
  const {
    copied,
    isLoading,
    shareUrl,
    error,
    handleCopyLink,
    handleEmailShare
  } = useShareProposal({ open, proposalId, proposalTitle });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir Propuesta</DialogTitle>
          <DialogDescription>
            Comparte esta propuesta mediante un enlace directo.
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProposalDialog;
