
import React from 'react';
import { PageSpeedData } from '@/types/report.types';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DesktopPerformance from './DesktopPerformance';
import MobilePerformance from './MobilePerformance';

interface PageSpeedTabProps {
  data?: PageSpeedData;
  isLoading?: boolean;
}

const PageSpeedTab: React.FC<PageSpeedTabProps> = ({ data, isLoading }) => {
  const hasDesktopData = data?.desktop && Object.keys(data.desktop).length > 0;
  const hasMobileData = data?.mobile && Object.keys(data.mobile).length > 0;
  const hasData = hasDesktopData || hasMobileData;

  if (!hasData && !isLoading) {
    return (
      <Alert variant="default" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No hay datos de PageSpeed disponibles</AlertTitle>
        <AlertDescription>
          No se han podido obtener datos de Google PageSpeed para esta URL.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DesktopPerformance data={data?.desktop} isLoading={isLoading} />
        <MobilePerformance data={data?.mobile} isLoading={isLoading} />
      </div>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Los datos de rendimiento se obtienen de Google PageSpeed Insights API y pueden variar con el tiempo.
          Para obtener resultados más precisos, considera realizar múltiples pruebas en diferentes momentos.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PageSpeedTab;
