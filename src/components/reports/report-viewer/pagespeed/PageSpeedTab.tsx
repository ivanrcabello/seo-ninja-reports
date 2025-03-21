
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeviceScoreCard from './DeviceScoreCard';
import EmptyState from './EmptyState';
import { Loader2 } from 'lucide-react';

interface PageSpeedDataProps {
  data: any;
  isLoading: boolean;
}

const PageSpeedTab: React.FC<PageSpeedDataProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || !data.desktop || !data.mobile) {
    return <EmptyState />;
  }

  return (
    <div className="w-full p-4">
      <Tabs defaultValue="desktop" className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="desktop">Escritorio</TabsTrigger>
            <TabsTrigger value="mobile">Móvil</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="desktop">
          <DeviceScoreCard device="desktop" data={data.desktop} />
        </TabsContent>
        
        <TabsContent value="mobile">
          <DeviceScoreCard device="mobile" data={data.mobile} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageSpeedTab;
