
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import DesktopPerformance from './DesktopPerformance';
import MobilePerformance from './MobilePerformance';

export interface PageSpeedDataProps {
  data: any;
  isLoading?: boolean; // Make isLoading optional with default value
}

const PageSpeedTab: React.FC<PageSpeedDataProps> = ({ 
  data,
  isLoading = false // Default value if not provided
}) => {
  const [activeDevice, setActiveDevice] = React.useState('desktop');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No hay datos de PageSpeed</h3>
        <p className="text-muted-foreground mb-6">
          No se han encontrado datos de PageSpeed para este informe.
        </p>
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0 py-6">
        <Tabs value={activeDevice} onValueChange={setActiveDevice}>
          <div className="mb-6 px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="desktop">Desktop</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="desktop" className="px-6">
            <DesktopPerformance data={data.desktop} />
          </TabsContent>

          <TabsContent value="mobile" className="px-6">
            <MobilePerformance data={data.mobile} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PageSpeedTab;
