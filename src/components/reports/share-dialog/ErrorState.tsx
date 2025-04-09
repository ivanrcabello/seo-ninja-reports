
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onClose: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onClose }) => {
  return (
    <div className="text-center py-4">
      <p className="text-red-500">{error}</p>
      <Button className="mt-4" onClick={onClose}>Cerrar</Button>
    </div>
  );
};

export default ErrorState;
