
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RefreshButtonProps {
  onClick: () => void;
  isRefreshing: boolean;
  tooltipText: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ 
  onClick, 
  isRefreshing, 
  tooltipText 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onClick}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn(
              "h-4 w-4", 
              isRefreshing && "animate-spin"
            )} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RefreshButton;
