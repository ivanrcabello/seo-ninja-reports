
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, Mail } from 'lucide-react';

interface ShareActionButtonsProps {
  onCopyLink: () => void;
  onEmailShare: () => void;
}

const ShareActionButtons: React.FC<ShareActionButtonsProps> = ({
  onCopyLink,
  onEmailShare
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Button 
        onClick={onCopyLink} 
        className="w-full sm:w-auto gap-2 group"
      >
        <Link className="h-4 w-4 group-hover:animate-pulse" />
        Copiar enlace
      </Button>
      <Button 
        variant="outline" 
        onClick={onEmailShare} 
        className="w-full sm:w-auto gap-2 group transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <Mail className="h-4 w-4 group-hover:animate-pulse" />
        Compartir por email
      </Button>
    </div>
  );
};

export default ShareActionButtons;
