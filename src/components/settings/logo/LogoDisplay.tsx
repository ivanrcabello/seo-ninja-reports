
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LogoDisplayProps {
  logo: string;
  onRemove: () => void;
  isUploading: boolean;
}

export const LogoDisplay: React.FC<LogoDisplayProps> = ({ logo, onRemove, isUploading }) => {
  return (
    <div className="relative w-full">
      <Button
        type="button"
        size="icon"
        variant="destructive"
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        disabled={isUploading}
      >
        <X className="h-4 w-4" />
      </Button>
      <div className="flex justify-center">
        <img 
          src={logo} 
          alt="Logo de la empresa" 
          className="max-h-32 mx-auto object-contain"
        />
      </div>
    </div>
  );
};
