
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ReportGeneratorHeaderProps {
  clientName?: string;
  step?: number;
  totalSteps?: number;
}

const ReportGeneratorHeader: React.FC<ReportGeneratorHeaderProps> = ({
  clientName = 'Cliente',
  step = 1,
  totalSteps = 6
}) => {
  const progress = (step / totalSteps) * 100;

  return (
    <CardHeader className="pb-3">
      <CardTitle className="text-xl">Generador de informes</CardTitle>
      <CardDescription className="flex items-center justify-between">
        <span>Creando informe para {clientName}</span>
        <span className="text-sm font-medium">
          Paso {step} de {totalSteps}
        </span>
      </CardDescription>
      
      <div className="w-full h-1 bg-muted rounded-full mt-3 overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </CardHeader>
  );
};

export default ReportGeneratorHeader;
