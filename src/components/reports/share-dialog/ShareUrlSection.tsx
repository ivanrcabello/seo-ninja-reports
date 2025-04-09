
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';

interface ShareUrlSectionProps {
  shareUrl: string;
  copied: boolean;
  onCopyLink: () => void;
}

const ShareUrlSection: React.FC<ShareUrlSectionProps> = ({
  shareUrl,
  copied,
  onCopyLink
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="grid flex-1 gap-2">
        <Input
          value={shareUrl}
          readOnly
          className="w-full"
        />
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onCopyLink} 
        className="transition-all group hover:bg-primary hover:text-primary-foreground"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500 group-hover:text-primary-foreground" />
        ) : (
          <Copy className="h-4 w-4 group-hover:text-primary-foreground" />
        )}
      </Button>
    </div>
  );
};

export default ShareUrlSection;
