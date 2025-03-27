
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportGenerator from './ReportGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ReportGeneratorWrapperProps {
  clientId: string;
  onBack?: () => void;
}

const ReportGeneratorWrapper: React.FC<ReportGeneratorWrapperProps> = ({ 
  clientId, 
  onBack 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
      </Button>
      
      <ReportGenerator clientId={clientId} />
    </div>
  );
};

export default ReportGeneratorWrapper;
