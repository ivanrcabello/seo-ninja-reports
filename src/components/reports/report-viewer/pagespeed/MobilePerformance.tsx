
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageSpeedResult } from '@/types/report.types';
import DeviceScoreCard from './DeviceScoreCard';

interface MobilePerformanceProps {
  data?: PageSpeedResult;
  isLoading?: boolean;
}

export const MobilePerformance: React.FC<MobilePerformanceProps> = ({ data, isLoading }) => {
  return (
    <DeviceScoreCard
      data={data}
      title="Rendimiento Mobile"
      subtitle="Análisis de rendimiento en dispositivos móviles"
      isLoading={isLoading}
    />
  );
};

export default MobilePerformance;
