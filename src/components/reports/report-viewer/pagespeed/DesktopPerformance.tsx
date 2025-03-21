
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageSpeedResult } from '@/types/report.types';
import DeviceScoreCard from './DeviceScoreCard';

interface DesktopPerformanceProps {
  data?: PageSpeedResult;
  isLoading?: boolean;
}

export const DesktopPerformance: React.FC<DesktopPerformanceProps> = ({ data, isLoading }) => {
  return (
    <DeviceScoreCard
      data={data}
      title="Rendimiento Desktop"
      subtitle="Análisis de rendimiento en dispositivos de escritorio"
      isLoading={isLoading}
    />
  );
};

export default DesktopPerformance;
