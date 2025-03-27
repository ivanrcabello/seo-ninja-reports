
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ReportGeneratorHeaderProps {
  clientName?: string;
}

const ReportGeneratorHeader: React.FC<ReportGeneratorHeaderProps> = ({ clientName }) => {
  return (
    <CardHeader className="text-center pb-4">
      <CardTitle className="text-2xl font-bold">
        Generar Informe SEO {clientName ? `para ${clientName}` : ''}
      </CardTitle>
      <CardDescription>
        Introduce los detalles del sitio web y sube archivos de apoyo para generar un informe SEO completo.
      </CardDescription>
    </CardHeader>
  );
};

export default ReportGeneratorHeader;
