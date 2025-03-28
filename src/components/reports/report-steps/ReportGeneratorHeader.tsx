
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ReportGeneratorHeaderProps {
  clientName?: string;
  step?: number;
}

const ReportGeneratorHeader: React.FC<ReportGeneratorHeaderProps> = ({ clientName, step }) => {
  // Función para mostrar el texto descriptivo según el paso actual
  const getStepDescription = () => {
    switch(step) {
      case 1:
        return "Primero realizaremos una auditoría SEO técnica del sitio web para detectar problemas fundamentales.";
      case 2:
        return "Añade material de apoyo y configura el perfil de negocio para enriquecer el informe.";
      case 3:
        return "Configura las palabras clave relevantes para el análisis de posicionamiento.";
      case 4:
        return "Añade notas o selecciona un informe SEO previo para complementar el análisis.";
      case 5:
        return "Revisa la configuración y genera el informe SEO completo.";
      default:
        return "Introduce los detalles del sitio web y sube archivos de apoyo para generar un informe SEO completo.";
    }
  };

  return (
    <CardHeader className="text-center pb-4">
      <CardTitle className="text-2xl font-bold">
        Generar Informe SEO {clientName ? `para ${clientName}` : ''}
      </CardTitle>
      <CardDescription>
        {getStepDescription()}
      </CardDescription>
    </CardHeader>
  );
};

export default ReportGeneratorHeader;
